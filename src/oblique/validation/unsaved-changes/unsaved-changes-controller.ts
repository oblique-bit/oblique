import {UnsavedChangesService} from './unsaved-changes-service';

export class UnsavedChangesController {

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

	/**
	 * Checks for unsaved changes on the whole form where the directive has been registered
	 *
	 * @return boolean
	 */
	modalCheck($event): boolean {
		return this.unsavedChangesService.modalOpening($event);
	}
}
