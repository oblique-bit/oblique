import {Component} from '@angular/core';
import {NotificationService} from '../../../../lib/ng/notification/notification.service';
import {NotificationType} from '../../../../lib/ng/notification/notification';
import {NotificationConfig} from '../../../../lib/ng/notification/notification-config';

@Component({
	selector: 'notification-sample',
	templateUrl: './notification-sample.component.html'
})
export class NotificationSampleComponent {

	appChannel: string;
	sampleChannel = 'demo';
	variants = NotificationType.VALUES;

	// Selection:
	channel = this.sampleChannel;
	variant = NotificationType.DEFAULT;
	title = 'Well done!';
	message = 'You successfully sent your first notification with ObliqueReactive :)';
	sticky = false;
	timeout = 2500;

	constructor(private notificationService: NotificationService) {
		this.appChannel = notificationService.config.channel;
	}

	send() {
		// NotificationConfig is optional:
		let config = {
			channel: this.channel,
			sticky: this.variant === NotificationType.ERROR || this.sticky,
			timeout: this.timeout
		} as NotificationConfig;

		switch (this.variant) {
			case NotificationType.INFO:
				this.notificationService.info(this.message, this.title, config);
				break;
			case NotificationType.SUCCESS:
				this.notificationService.success(this.message, this.title, config);
				break;
			case NotificationType.WARNING:
				this.notificationService.warning(this.message, this.title, config);
				break;
			case NotificationType.ERROR:
				this.notificationService.error(this.message, this.title, config);
				break;
			default:
				this.notificationService.default(this.message, this.title, config);
				break;
		}
	}

	clear() {
		this.notificationService.clear(this.channel);
	}

	public clearAllChannels() {
		this.notificationService.clearAll();
	}
}
