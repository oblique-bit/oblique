import {Component, Input} from '@angular/core';
import {INotification} from '../notification.interfaces';

@Component({
	selector: 'or-notification',
	exportAs: 'orNotification',
	template: ''
})
export class MockNotificationComponent {
	static REMOVE_DELAY = 350;
	@Input() channel: string;
	customChannel = false;
	notifications: INotification[] = [];
	variant: { [type: string]: string } = {};

	open(notification: INotification): void {
	}

	close(notification): void {
	}

	remove(notification: Notification): void {
	}

	clear(): void {
	}
}
