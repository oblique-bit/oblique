import {Component} from '@angular/core';
import {
	NotificationConfig,
	NotificationService,
	NotificationType
} from 'oblique-reactive';

@Component({
	selector: 'notification-sample',
	templateUrl: './notification-sample.component.html'
})
export class NotificationSampleComponent {
	messageWithParams = false;
	titleWithParams = false;
	appChannel: string;
	sampleChannel = 'demo';
	variants = NotificationType.VALUES;

	// Selection:
	channel = this.sampleChannel;
	variant = NotificationType.INFO;
	title = {
		text: 'Well done!',
		key: 'i18n.notification.sampleTitle',
		params: {
			title: 'title',
			parameters: 'parameters'
		}
	};
	message = {
		text: 'You successfully sent your first notification with ObliqueReactive :)',
		key: 'i18n.notification.sampleMessage',
		params: {
			message: 'message',
			parameters: 'parameters'
		}
	};
	sticky = false;
	timeout = 2500;

	constructor(private readonly notificationService: NotificationService) {
		this.appChannel = notificationService.config.channel;
	}

	send() {
		// NotificationConfig is optional:
		const config = {
			channel: this.channel,
			sticky: this.variant === NotificationType.ERROR || this.sticky,
			timeout: this.timeout
		} as NotificationConfig;

		const message = this.messageWithParams ? {key: this.message.key, params: this.message.params} : this.message.text;
		const title = this.titleWithParams ? {key: this.title.key, params: this.title.params} : this.title.text;
		switch (this.variant) {
			case NotificationType.INFO:
				this.notificationService.info(message, title, config);
				break;
			case NotificationType.SUCCESS:
				this.notificationService.success(message, title, config);
				break;
			case NotificationType.WARNING:
				this.notificationService.warning(message, title, config);
				break;
			case NotificationType.ERROR:
				this.notificationService.error(message, title, config);
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
