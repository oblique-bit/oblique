import {ObUnsavedChangesService} from './unsaved-changes.service';
import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';

@Injectable({providedIn: 'root'})
export class ObUnsavedChangesGuard implements CanDeactivate<any> {
	// NOTE: Currently this guard has to be added on every route where it's used
	//      If this Issue: https://github.com/angular/angular/issues/11836  is resolved, we can rewrite it

	constructor(private readonly unsavedChangesService: ObUnsavedChangesService) {}

	canDeactivate(): boolean {
		return this.unsavedChangesService.canDeactivate();
	}
}
