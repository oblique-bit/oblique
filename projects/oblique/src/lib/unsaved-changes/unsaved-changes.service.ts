import {Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

//TODO: Handle modals
@Injectable({providedIn: 'root'})
export class UnsavedChangesService {
	private readonly formList: { [key: string]: ControlContainer} = {};

	constructor(private readonly translateService: TranslateService) {
		window.addEventListener('beforeunload', e => this.onUnload(e));
		window.addEventListener('unload', e => this.onUnload(e));
	}

	watch(formId: string, form: ControlContainer): void {
		this.formList[formId] = form;
	}

	unWatch(formId: string): void {
		delete this.formList[formId];
	}

	canDeactivate(): boolean {
		return this.hasPendingChanges() ? window.confirm(this.message()) : true;
	}

	ignoreChanges(formIds: string[]): boolean {
		return this.hasPendingChanges(formIds) ? window.confirm(this.message()) : true;
	}

	private onUnload(event: BeforeUnloadEvent) {
		if (this.hasPendingChanges()) {
			const confirmationMessage = this.message();
			event.returnValue = confirmationMessage;

			return confirmationMessage;
		}

		return null;
	}

	private hasPendingChanges(ids: string[] = Object.keys(this.formList)): boolean {
		return Object.keys(this.formList).filter(
			(formId) => ids.indexOf(formId) > -1 && this.formList[formId].dirty
		).length > 0;
	}

	private message(): string {
		return this.translateService.instant('i18n.validation.unsavedChanges');
	}
}
