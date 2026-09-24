import {Injectable} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable({providedIn: 'root'})
export class ObMockUnsavedChangesGuard {
	canDeactivate(): boolean {
		return true;
	}
}
