import {Injectable} from '@angular/core';
import {ControlContainer} from '@angular/forms';

@Injectable()
export class ObMockUnsavedChangesService {
	public isActive = true;

	watch(formId: string, form: ControlContainer): void {}

	unWatch(formId: string): void {}

	canDeactivate(): boolean {
		return true;
	}

	ignoreChanges(formIds: string[]): boolean {
		return true;
	}
}
