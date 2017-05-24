import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {Subscriber} from 'rxjs/Subscriber';
import 'rxjs/add/operator/filter';

//TODO: Handle modals
@Injectable()
export class UnsavedChangesService {
	private formList: {[key:string]: ControlContainer} = {};
	private listener: {[key:string]: Subscriber<NgbTabChangeEvent>} = {};

	constructor(private translateService: TranslateService, private router: Router) {
		window.addEventListener('beforeunload', e => this.onUnload(e));

		this.router.events.filter(event => event instanceof NavigationEnd).subscribe(() => {
			Object.keys(this.listener).forEach(key => this.listener[key].unsubscribe());
			this.listener = {};
		});
	}

	watch(formId: string, form: ControlContainer): void {
		this.formList[formId] = form;
	}

	unWatch(formId: string): void {
		delete this.formList[formId];
	}

	listenTo(ngbTabset: NgbTabset) {
		let id = ngbTabset.tabs.first.id;
		if (!this.listener[id])
			this.listener[id] = ngbTabset.tabChange.subscribe((event: NgbTabChangeEvent): void => {
				if (!this.canDeactivateTab(event.activeId))
					event.preventDefault();
			});
	}

	isFormDirty(formId: string): boolean {
		let form = this.formList[formId];
		return form && form.dirty;
	}

	private onUnload(event: BeforeUnloadEvent) {
		if (this.hasPendingChanges()) {
			const confirmationMessage = this.message();
			event.returnValue = confirmationMessage;

			return confirmationMessage;
		}

		return null;
	}

	private canDeactivateTab(formId: string): boolean {
		return this.isFormDirty(formId) ? window.confirm(this.message()) : true;
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
