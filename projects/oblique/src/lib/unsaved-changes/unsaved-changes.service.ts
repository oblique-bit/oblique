import {Inject, Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ObPopUpService} from '../pop-up/pop-up.service';
import {WINDOW} from '../utilities';

@Injectable({providedIn: 'root'})
export class ObUnsavedChangesService {
	private readonly controlContainer: {[key: string]: ControlContainer} = {};

	constructor(private readonly translateService: TranslateService, private readonly popUpService: ObPopUpService, @Inject(WINDOW) window) {
		window.addEventListener('beforeunload', e => this.onUnload(e));
		window.addEventListener('unload', e => this.onUnload(e));
	}

	watch(formId: string, form: ControlContainer): void {
		this.controlContainer[formId] = form;
	}

	unWatch(formId: string): void {
		delete this.controlContainer[formId];
	}

	canDeactivate(): boolean {
		return this.ignoreChanges();
	}

	ignoreChanges(formIds?: string[]): boolean {
		return this.hasPendingChanges(formIds) ? this.popUpService.confirm(this.message()) : true;
	}

	private onUnload(event: BeforeUnloadEvent) {
		if (this.hasPendingChanges()) {
			const confirmationMessage = this.message();
			event.returnValue = confirmationMessage;

			return confirmationMessage;
		}

		return null;
	}

	private hasPendingChanges(ids: string[] = Object.keys(this.controlContainer)): boolean {
		return Object.keys(this.controlContainer).filter(formId => ids.indexOf(formId) > -1 && this.controlContainer[formId].dirty).length > 0;
	}

	private message(): string {
		return this.translateService.instant('i18n.validation.unsavedChanges');
	}
}
