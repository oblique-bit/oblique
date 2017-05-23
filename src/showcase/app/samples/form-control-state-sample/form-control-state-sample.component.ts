import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {NotificationService} from '../../../../lib';

@Component({
	selector: 'app-form-control-state-sample',
	templateUrl: './form-control-state-sample.component.html',
	styleUrls: ['./form-control-state-sample.component.scss']
})
export class FormControlStateSampleComponent {

	constructor(private notificationService: NotificationService) {

	}

	check(form: NgForm) {
		if (form.valid) {
			this.notificationService.success('Congratulations, your data is valid!');
		} else {
			this.notificationService.warn('Oups, your data does not look to be valid!');
		}
	}
}
