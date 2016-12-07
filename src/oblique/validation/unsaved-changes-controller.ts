import {UnsavedChangesService} from 'oblique-reactive/oblique';

export class UnsavedChangesController implements ng.IDirective {

	/*@ngInject*/
	constructor(private unsavedChangesService:UnsavedChangesService) {
	}

	/**
	 * Checks for unsaved changes on the whole form where the directive has been registered
	 * or only on the nested form if `nestedForm` is specified.
	 *
	 * @param nestedForm
	 */
	check($event, nestedForm?) {
		!this.unsavedChangesService.check(nestedForm) && $event.preventDefault();
	}
}
