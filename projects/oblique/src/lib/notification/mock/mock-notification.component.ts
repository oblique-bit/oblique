import {Component, Input} from '@angular/core';
import {ObINotification} from '../notification.interfaces';

@Component({
	selector: 'ob-notification',
	exportAs: 'obNotification',
	template: ''
})
export class ObMockNotificationComponent {
	static REMOVE_DELAY = 350;
	@Input() channel: string;
	customChannel = false;
	notifications: ObINotification[] = [];
	variant: { [type: string]: string } = {};

	open(notification: ObINotification): void {
	}

	close(notification): void {
	}

	remove(notification: Notification): void {
	}

	clear(): void {
	}
}
