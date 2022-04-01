import {Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ObPopUpService} from '../pop-up/pop-up.service';
import {ObGlobalEventsService} from '../global-events/global-events.service';

@Injectable({providedIn: 'root'})
export class ObUnsavedChangesService {
	public isActive = true;
	private readonly controlContainer: Record<string, ControlContainer> = {};

	constructor(
		private readonly obGlobalEventsService: ObGlobalEventsService,
		private readonly translateService: TranslateService,
		private readonly popUpService: ObPopUpService
	) {
		obGlobalEventsService.beforeUnload$.subscribe(event => this.onUnload(event));
	}

	watch(formId: string, form: ControlContainer): void {
		this.controlContainer[formId] = form;
	}

	unWatch(formId: string): void {
		delete this.controlContainer[formId];
	}

	// Todo: remove. because: ignoreChanges has the same job
	canDeactivate(): boolean {
		return this.ignoreChanges();
	}

	// Todo: (because of return type of boolean) rename method e.g is...() has...() to predicate as a question or use
	//  the predicate as an assertion. @see also https://dev.to/michi/tips-on-naming-boolean-variables-cleaner-code-35ig
	ignoreChanges(formIds?: string[]): boolean {
		return this.hasPendingChanges(formIds) ? this.popUpService.confirm(this.message()) : true;
	}

	private onUnload(event: BeforeUnloadEvent): string | null {
		if (this.hasPendingChanges()) {
			const confirmationMessage = this.message();
			event.returnValue = confirmationMessage;
			return confirmationMessage;
		}
		return null;
	}

	private hasPendingChanges(ids: string[] = Object.keys(this.controlContainer)): boolean {
		const includesPendingChanges =
			Object.keys(this.controlContainer).filter(formId => ids.includes(formId) && this.controlContainer[formId].dirty).length > 0;
		return this.isActive && includesPendingChanges;
	}

	private message(): string {
		return this.translateService.instant('i18n.validation.unsavedChanges');
	}
}
