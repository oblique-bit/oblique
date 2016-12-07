import {UnsavedChangesController} from 'oblique-reactive/oblique/validation/unsaved-changes-controller';
import {UnsavedChangesService} from 'oblique-reactive/oblique';

/**
 * Directive that indicates that the form must be tracked for any unsaved changes.
 *
 * @see UnsavedChangesService
 */
export class UnsavedChangesDirective implements ng.IDirective {
	restrict = 'A';
	require = '^form';
	// controller = UnsavedChangesController;
	// controllerAs = 'orUnsavedChangesController';

	/*@ngInject*/
	constructor(private unsavedChangesService:UnsavedChangesService) {
		console.log(unsavedChangesService);
	}

	link = (scope, element, attrs, formCtrl) => {
		console.log(formCtrl);
		if (formCtrl) {
			this.unsavedChangesService.watchForm(formCtrl, 'watchFormTab' in attrs);
		}
	}
}
