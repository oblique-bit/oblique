import {Injectable, HostListener} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/filter';

//TODO: Handle modals
@Injectable()
export class UnsavedChangesService {
	private forms: ControlContainer[] = [];
	private tabs = {};

	constructor(private translateService: TranslateService) {
		window.addEventListener('beforeunload', (e) => this.onUnload(e));
	}

	watch(form: ControlContainer, tab) {
		console.log(form);
		console.log(tab);
		this.forms.push(form);
		// if (tab)
		// 	this.tabs
	}


	checkForChanges(event) {
		if (this.hasPendingChanges() && !confirm(this.message()))
			event.preventDefault();
	}

	hasUnsavedChanges() {
		return this.hasPendingChanges() || confirm(this.message());
	}

	watchTab(tab) {
		console.log(tab);
		// this.tabs[];
	}

	unWatch(form: ControlContainer) {
		this.forms.splice(this.forms.indexOf(form));
	}

	canDeactivate(nestedForm?: ControlContainer) {
		if ((nestedForm && nestedForm.dirty) || this.hasPendingChanges()) {
			return window.confirm(this.message());
		}
		return true;
	}

	onUnload(event: BeforeUnloadEvent) {
		if (this.hasPendingChanges()) {
			const confirmationMessage = this.message();

			event.returnValue = confirmationMessage;
			return confirmationMessage;
		}

		return null;
	}

	private hasPendingChanges() {
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
