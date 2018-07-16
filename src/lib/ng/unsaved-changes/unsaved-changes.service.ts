import {Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {NgbTabChangeEvent, NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {Subscriber} from 'rxjs';

//TODO: Handle modals
@Injectable()
export class UnsavedChangesService {
	private formList: { [key: string]: ControlContainer} = {};
	private listener: { [key: string]: Subscriber<NgbTabChangeEvent>} = {};

	constructor(private translateService: TranslateService) {
		window.addEventListener('beforeunload', e => this.onUnload(e));
		window.addEventListener('unload', e => this.onUnload(e));
	}

	watch(formId: string, form: ControlContainer): void {
		this.formList[formId] = form;
	}

	unWatch(formId: string): void {
		delete this.formList[formId];
	}

	listenTo(ngbTabset: NgbTabset): void {
		const id = ngbTabset.tabs.first.id;
		if (!this.listener[id]) {
			this.listener[id] = ngbTabset.tabChange.subscribe((event: NgbTabChangeEvent): void => {
				if (!this.ignoreChanges([event.activeId])) {
					event.preventDefault();
				}
			});
		}
	}

	unListenTo(ngbTabset: NgbTabset): void {
		const id = ngbTabset && ngbTabset.tabs.first.id;
		if (this.listener[id]) {
			this.listener[id].unsubscribe();
			delete this.listener[id];
		}
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
