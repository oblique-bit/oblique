import {Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ObMockUnsavedChangesTabsService {
	watch(formId: string, form: ControlContainer): void {
	}

	unWatch(formId: string): void {
	}

	listenTo(ngbTabset: NgbTabset): void {
	}

	unListenTo(ngbTabset: NgbTabset): void {
	}

	canDeactivate(): boolean {
		return true;
	}

	ignoreChanges(formIds: string[]): boolean {
		return true;
	}
}
