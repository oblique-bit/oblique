import {Component} from '@angular/core';
import {NotificationService} from '../../../../lib/ng/notification/notification.service';

@Component({
	selector: 'notification-sample',
	templateUrl: './notification-sample.component.html'
})
export class NotificationSampleComponent {

	sampleChannel = 'demo';

	// Selection:
	channel = this.sampleChannel;
	title = 'Well done!';
	message = 'You successfully sent your first notification with ObliqueReactive :)';
	sticky = true;
	timeout = NotificationService.DEFAULT_TIMEOUT;

	constructor(private notificationService: NotificationService) {}

	send() {
		this.notificationService.info(this.message, this.title, this.sticky, this.channel);
	}

	clear() {
		this.notificationService.clear(this.channel);
	}

	public clearAllChannels() {
		this.notificationService.clearAll();
	}
}
