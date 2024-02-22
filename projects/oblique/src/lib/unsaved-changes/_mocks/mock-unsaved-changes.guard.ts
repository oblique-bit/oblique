import {Injectable} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable({providedIn: 'root'})
export class ObMockUnsavedChangesGuard {
	canDeactivate(): boolean {
		return true;
	}
}
