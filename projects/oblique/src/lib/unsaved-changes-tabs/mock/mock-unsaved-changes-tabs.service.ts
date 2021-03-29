import {Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {NgbNav} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ObMockUnsavedChangesTabsService {
	watch(formId: string, form: ControlContainer): void {}

	unWatch(formId: string): void {}

	listenTo(ngbTabset: NgbNav): void {}

	unListenTo(ngbTabset: NgbNav): void {}

	canDeactivate(): boolean {
		return true;
	}

	ignoreChanges(formIds: string[]): boolean {
		return true;
	}
}
