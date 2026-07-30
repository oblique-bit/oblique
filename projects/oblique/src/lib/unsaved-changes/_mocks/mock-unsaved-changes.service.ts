import {Injectable, signal} from '@angular/core';
import {ControlContainer} from '@angular/forms';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable()
export class ObMockUnsavedChangesService {
	public readonly isActive = signal(true);

	watch(formId: string, form: ControlContainer): void {}

	unWatch(formId: string): void {}

	canDeactivate(): boolean {
		return true;
	}

	ignoreChanges(formIds?: string[]): boolean {
		return true;
	}
}
