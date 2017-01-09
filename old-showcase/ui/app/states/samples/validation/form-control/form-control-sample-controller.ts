import {NotificationService} from 'oblique-reactive/../../../../../../../old-lib/oblique-reactive';

export class FormControlSampleController {

	comp:number;

	/*@ngInject*/
	constructor(private notificationService: NotificationService) {
	}

	public setInvalid(ngModelCtrl: ng.INgModelController) {
		ngModelCtrl.$setViewValue('Invalid');
		ngModelCtrl.$render();
	}

	public setValid(ngModelCtrl: ng.INgModelController) {
		ngModelCtrl.$setViewValue(42);
		ngModelCtrl.$render();
	}

	check(form) {
		if (form.$valid) {
			this.notificationService.success('Congratulations, your data is valid!');
		} else {
			this.notificationService.warn('Oups, your data does not look to be valid!');
		}
	}
}