import {Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/filter';

//TODO: Handle modals
@Injectable()
export class UnsavedChangesService {
	private forms: ControlContainer[] = [];

	constructor(private translateService: TranslateService) {
		window.addEventListener('beforeunload', (e) => {
			return this.onUnload(e);
		});
	}

	watch(form: ControlContainer) {
		this.forms.push(form);
	}

	unWatch(form: ControlContainer) {
		this.forms.splice(this.forms.indexOf(form));
	}

	canDeactivate(nestedForm?: ControlContainer) {
		if ((nestedForm && nestedForm.dirty) || this.hasUnsavedChanges()) {
			return window.confirm(this.message());
		}
		return true;
	}

	onUnload(event: BeforeUnloadEvent) {
		if (this.hasUnsavedChanges()) {
			const confirmationMessage = this.message();

			event.returnValue = confirmationMessage;
			return confirmationMessage;
		}

		return null;
	}

	private hasUnsavedChanges() {
		for (const form of this.forms) {
			if (form.dirty) {
				return true;
			}
		}
		return false;
	}

	private message() {
		return this.translateService.instant('i18n.validation.unsavedChanges');
	}
}
