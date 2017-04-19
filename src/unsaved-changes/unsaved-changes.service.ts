import {Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/filter';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

//TODO: Handle modals
@Injectable()
export class UnsavedChangesService {
	private forms: ControlContainer[] = [];
	private tabs = {};

	constructor(private translateService: TranslateService) {
		window.addEventListener('beforeunload', (e) => this.onUnload(e));
	}

	watch(form: ControlContainer, tab?: string): void {
		this.forms.push(form);
		if (tab) {
			this.tabs[tab] = form;
		}
	}

	checkForTabChanges(event: NgbTabChangeEvent): void {
		if (this.hasPendingChangesInTabs()) {
			if (!confirm(this.message()))
				event.preventDefault();
			else if (this.tabs[event.activeId]) {
				this.tabs[event.activeId].resetForm();
			}
		}
	}

	unWatch(form: ControlContainer): void {
		this.forms.splice(this.forms.indexOf(form));
	}

	canDeactivate(nestedForm?: ControlContainer): boolean {
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

	private hasPendingChanges(): boolean {
		for (const form of this.forms) {
			if (form.dirty) {
				return true;
			}
		}
		return false;
	}

	private hasPendingChangesInTabs(): boolean {
		for (const form in this.tabs) {
			if (this.tabs[form].dirty) {
				return true;
			}
		}
		return false;
	}

	private message(): string {
		return this.translateService.instant('i18n.validation.unsavedChanges');
	}
}
