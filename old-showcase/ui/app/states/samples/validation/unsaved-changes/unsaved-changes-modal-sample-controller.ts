import {NotificationService} from 'oblique-reactive/oblique';
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;

export class UnsavedChangesModalSampleController {

	/*@ngInject*/
	constructor(private notificationService:NotificationService, private $uibModalInstance:IModalServiceInstance) {}

	save(form) {
		if (form.$valid) {
			form.$setPristine();
			this.$uibModalInstance.close();
			this.notificationService.success('Form has been successfully saved!');
		}
	}

	cancel() {
		this.$uibModalInstance.dismiss();
	}
}