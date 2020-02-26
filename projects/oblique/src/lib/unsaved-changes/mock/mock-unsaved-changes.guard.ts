import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ObMockUnsavedChangesGuard {
	canDeactivate(): boolean {
		return true;
	}
}
