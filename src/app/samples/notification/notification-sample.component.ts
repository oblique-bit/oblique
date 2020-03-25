import {Component} from '@angular/core';
import {ObNotificationService, ObENotificationType} from 'oblique';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'notification-sample',
	templateUrl: './notification-sample.component.html'
})
export class NotificationSampleComponent {
	messageWithParams = false;
	titleWithParams = false;
	appChannel = 'oblique';
	sampleChannel = 'demo';
	variants = ObENotificationType;

	// Selection:
	channel = this.sampleChannel;
	variant = ObENotificationType.INFO;
	title = 'Well done!';
	titleKey = 'i18n.notification.sampleTitle';
	titleParams = {
		title: 'title',
		parameters: 'parameters'
	};
	message = 'You successfully sent your first notification with Oblique :)';
	messageKey = 'i18n.notification.sampleMessage';
	messageParams = {
		message: 'message',
		parameters: 'parameters'
	};
	sticky = false;
	timeout = 2500;
	group = false;

	constructor(private readonly notificationService: ObNotificationService) {
	}

	get clearAllOnNavigate() {
		return this.notificationService.clearAllOnNavigate;
	}

	set clearAllOnNavigate(value: boolean) {
		this.notificationService.clearAllOnNavigate = value;
	}

	send() {
		this.notificationService.send({
			message: this.messageWithParams ? this.messageKey : this.message,
			messageParams: this.messageWithParams ? this.messageParams : undefined,
			title: this.titleWithParams ? this.titleKey : this.title,
			titleParams: this.titleWithParams ? this.titleParams : undefined,
			sticky: this.sticky,
			channel: this.channel,
			timeout: this.timeout,
			groupSimilar: this.group,
			type: this.variant
		});
	}

	clear() {
		this.notificationService.clear(this.channel);
	}

	public clearAllChannels() {
		this.notificationService.clearAll();
	}
}
