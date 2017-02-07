import {NotificationService} from 'oblique-reactive/oblique';
import IModalService = angular.ui.bootstrap.IModalService;

export class UnsavedChangesSampleController {

	/*@ngInject*/
	constructor(private notificationService:NotificationService, private $uibModal:IModalService) {
	}

	save(form) {
		if (form.$valid) {
			form.$setPristine();
			this.notificationService.success('Form has been successfully saved!');
		}
	}

	open() {
		this.$uibModal.open({
			templateUrl: 'app/states/samples/validation/unsaved-changes/unsaved-changes-modal-sample.tpl.html',
			controller: 'unsavedChangesModalSampleController',
			controllerAs: 'ctrl'
		});
	};
}
