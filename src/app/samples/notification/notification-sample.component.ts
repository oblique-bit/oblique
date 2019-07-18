import {Component} from '@angular/core';
import {NotificationService, NotificationType} from 'oblique';

@Component({
	selector: 'notification-sample',
	templateUrl: './notification-sample.component.html'
})
export class NotificationSampleComponent {
	messageWithParams = false;
	titleWithParams = false;
	appChannel: string;
	sampleChannel = 'demo';
	variants = NotificationType;

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
		text: 'You successfully sent your first notification with Oblique :)',
		key: 'i18n.notification.sampleMessage',
		params: {
			message: 'message',
			parameters: 'parameters'
		}
	};
	sticky = false;
	timeout = 2500;

	constructor(private readonly notificationService: NotificationService) {
		this.appChannel = 'default';
	}

	send() {
		const message = this.messageWithParams ? {key: this.message.key, params: this.message.params} : this.message.text;
		const title = this.titleWithParams ? {key: this.title.key, params: this.title.params} : this.title.text;
		this.notificationService.send({message, title, sticky: this.sticky, channel: this.channel, timeout: this.timeout, type: this.variant});
	}

	clear() {
		this.notificationService.clear(this.channel);
	}

	public clearAllChannels() {
		this.notificationService.clearAll();
	}
}
