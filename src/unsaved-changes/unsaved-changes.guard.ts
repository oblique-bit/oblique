import {UnsavedChangesService} from './unsaved-changes.service';
import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';

@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<any> {

	//TODO: Currently this guard has to be added on every route where it's used
	//      If this Issue: https://github.com/angular/angular/issues/11836  is resolved, we can rewrite it

	constructor(private unsavedChangesService: UnsavedChangesService) {

	}

	canDeactivate() {
		return true;
		// return this.unsavedChangesService.canDeactivate();
	}
}
