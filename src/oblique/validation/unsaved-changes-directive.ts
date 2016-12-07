import {UnsavedChangesController} from 'oblique-reactive/oblique/validation/unsaved-changes-controller';
import {UnsavedChangesService} from 'oblique-reactive/oblique';

/**
 * Tracks unsaved form changes.
 *
 * @see UnsavedChangesService
 */
export class UnsavedChangesDirective implements ng.IDirective {
	restrict = 'A';
	require = '^form';
	controller = UnsavedChangesController;
	controllerAs = 'orUnsavedChangesController';

	/*@ngInject*/
	constructor(private unsavedChangesService:UnsavedChangesService) {
	}

	link = (scope, element, attrs, formCtrl) => {
		this.unsavedChangesService.watch(formCtrl);
	}
}
