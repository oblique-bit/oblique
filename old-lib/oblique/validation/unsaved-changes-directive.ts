import {UnsavedChangesController} from './unsaved-changes-controller';
import {UnsavedChangesService} from './unsaved-changes-service';

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

		scope.$on('modal.closing', this.unsavedChangesService.modalClosing.bind(this.unsavedChangesService));
	}
}
