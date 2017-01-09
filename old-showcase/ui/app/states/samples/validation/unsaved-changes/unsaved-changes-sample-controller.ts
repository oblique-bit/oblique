import {NotificationService} from 'oblique-reactive/../../../../../../.';

export class UnsavedChangesSampleController {

	/*@ngInject*/
	constructor(private notificationService:NotificationService) {
	}

	save(form) {
		if (form.$valid) {
			form.$setPristine();
			this.notificationService.success('Form has been successfully saved!');
		}
	}
}
