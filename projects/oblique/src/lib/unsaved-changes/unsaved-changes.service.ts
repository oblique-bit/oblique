import {Injectable, computed, inject, signal} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {WINDOW} from '../window/window.provider';
import {ObWindow} from '../window/window.provider.model';

@Injectable({providedIn: 'root'})
export class ObUnsavedChangesService {
	public readonly isActive = signal(true);

	private readonly forms = signal<Record<string, ControlContainer>>({});
	private readonly hasPendingChanges = computed(
		() => this.isActive() && Object.values(this.forms()).some(form => form.dirty)
	);
	private readonly translateService = inject(TranslateService);
	private readonly window = inject<ObWindow>(WINDOW);

	constructor() {
		const obGlobalEventsService = inject(ObGlobalEventsService);

		obGlobalEventsService.beforeUnload$.subscribe(event => {
			this.onUnload(event);
		});
	}

	watch(formId: string, form: ControlContainer): void {
		this.forms.update(current => ({...current, [formId]: form}));
	}

	unWatch(formId: string): void {
		this.forms.update(current => {
			const next = {...current};
			delete next[formId];
			return next;
		});
	}

	// Todo: remove. because: ignoreChanges has the same job
	canDeactivate(): boolean {
		return this.ignoreChanges();
	}

	// Todo: (because of return type of boolean) rename method e.g is...() has...() to predicate as a question or use
	//  the predicate as an assertion. @see also https://dev.to/michi/tips-on-naming-boolean-variables-cleaner-code-35ig
	ignoreChanges(formIds?: string[]): boolean {
		return this.hasPendingChangesFor(formIds) ? this.window.confirm(this.message()) : true;
	}

	private onUnload(event: BeforeUnloadEvent): string | null {
		if (this.hasPendingChanges()) {
			const confirmationMessage = this.message();
			event.returnValue = confirmationMessage;
			return confirmationMessage;
		}
		return null;
	}

	private hasPendingChangesFor(ids?: string[]): boolean {
		const forms = this.forms();
		const targetForms = ids ? ids.filter(id => id in forms).map(id => forms[id]) : Object.values(forms);
		return this.isActive() && targetForms.some(form => form.dirty);
	}

	private message(): string {
		return this.translateService.instant('i18n.validation.unsavedChanges');
	}
}
