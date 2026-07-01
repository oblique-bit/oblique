import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ObINotification} from '../notification.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-notification',
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	exportAs: 'obNotification',
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
