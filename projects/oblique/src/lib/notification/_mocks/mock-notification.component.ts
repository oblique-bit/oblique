import {Component, Input} from '@angular/core';
import {ObINotification} from '../notification.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
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
	variant: Record<string, string> = {};

	open(notification: ObINotification): void {}

	close(notification): void {}

	remove(notification: Notification): void {}

	clear(): void {}
}
