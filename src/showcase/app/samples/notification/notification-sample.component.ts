import {Component} from '@angular/core';
import {NotificationService} from '../../../../lib/ng/notification/notification.service';

@Component({
	selector: 'notification-sample',
	templateUrl: './notification-sample.component.html'
})
export class NotificationSampleComponent {

	title = 'Well done!';
	message = 'You successfully sent your first notification with ObliqueReactive :)';
	sticky = true;

	constructor(private notificationService: NotificationService) {}

	send() {
		this.notificationService.info(this.message, this.title, this.sticky);
	}
}
