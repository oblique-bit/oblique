import {Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/filter';

//TODO: Handle modals
@Injectable()
export class UnsavedChangesService {
	private formList : {[key:string]: ControlContainer} = {};

	constructor(private translateService: TranslateService) {
		window.addEventListener('beforeunload', (e) => this.onUnload(e));
	}

	watch(formId: string, form: ControlContainer): void {
		this.formList[formId] = form;
	}

	unWatch(formId: string): void {
		delete this.formList[formId];
	}

	canDeactivateTab(formId: string): boolean {
		let form = this.formList[formId];
		return form && form.dirty ? window.confirm(this.message()) : true;
	}

	onUnload(event: BeforeUnloadEvent) {
		if (this.hasPendingChanges()) {
			const confirmationMessage = this.message();

			event.returnValue = confirmationMessage;
			return confirmationMessage;
		}

		return null;
	}

	private hasPendingChanges(): boolean {
		for (const formId in this.formList) {
			if (this.formList.hasOwnProperty(formId) && this.formList[formId].dirty) {
				return true;
			}
		}
		return false;
	}

	private message(): string {
		return this.translateService.instant('i18n.validation.unsavedChanges');
	}
}
