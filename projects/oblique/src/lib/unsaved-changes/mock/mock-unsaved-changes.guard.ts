import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MockUnsavedChangesGuard {
	canDeactivate(): boolean {
		return true;
	}
}
