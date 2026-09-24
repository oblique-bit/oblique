import {Component, ViewEncapsulation, computed, inject, input, signal} from '@angular/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslatePipe} from '@ngx-translate/core';
import {ObAlertComponent} from '../alert/alert.component';
import {ObTranslateParamsPipe} from '../translate-params/translate-params.pipe';
import {WINDOW} from '../window/window.provider';
import {ObWindow} from '../window/window.provider.model';
import {ObENotificationPlacement, ObINotification, ObINotificationPrivate} from './notification.model';
import {ObNotificationService} from './notification.service';

@Component({
	selector: 'ob-notification',
	imports: [MatTooltipModule, ObAlertComponent, ObTranslateParamsPipe, TranslatePipe],
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss', './notification-animations.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.ob-custom]': 'customChannel()',
		'[class]': 'getPlacement',
		class: 'ob-notification-container',
	},
	exportAs: 'obNotification',
})
export class ObNotificationComponent {
	public static REMOVE_DELAY = 350;
	readonly channel = input<string>();
	readonly currentChannel = computed(() => this.channel() ?? this.notificationService.config.channel);
	readonly customChannel = computed(() => this.currentChannel() !== 'oblique');
	readonly notifications = signal<ObINotificationPrivate[]>([]);

	get getPlacement(): ObENotificationPlacement {
		return this.notificationService.placement;
	}
	public variant: Record<string, string> = {};

	private readonly window = inject<ObWindow>(WINDOW);
	private readonly notificationService = inject(ObNotificationService);

	constructor() {
		this.notificationService.events.pipe(takeUntilDestroyed()).subscribe(notification => {
			if (!notification || (!notification.message && notification.channel === this.currentChannel())) {
				this.clear();
			} else if (notification.channel === this.currentChannel()) {
				this.open(notification);
			}
		});
	}

	/**
	 * Adds & opens the specified notification.
	 */
	public open(notification: ObINotification): void {
		const existingNotification = this.notifications().find(notif => notif.idPrefix === notification.idPrefix);
		if (existingNotification && notification.groupSimilar) {
			existingNotification.occurrences.update(occurrences => occurrences + 1);
		} else {
			const extendedNotification = this.extendNotification(notification);
			this.notifications.update(notifs => [extendedNotification, ...notifs]);
			if (!extendedNotification.sticky) {
				this.selfClose(extendedNotification);
			}
		}
	}

	/**
	 * Closes & removes the specified notification.
	 *
	 * @see remove
	 */
	public close(notification: ObINotificationPrivate): void {
		notification.$state.set('out');
		clearTimeout(notification.timer);
		this.window.setTimeout(() => this.remove(notification), ObNotificationComponent.REMOVE_DELAY);
	}

	/**
	 * Removes the specified notification without triggering a _close_ animation.
	 */
	public remove(notification: ObINotificationPrivate): void {
		// don't use idPrefix, because multiple notifications could share the same one
		notification.$state.set('remove');
		this.notifications.update(notifs => notifs.filter(notif => notif.$state() !== 'remove'));
	}

	/**
	 * Closes all notifications in the current subscribed channel.
	 */
	public clear(): void {
		this.notifications().forEach(notification => this.close(notification));
	}

	private extendNotification(notification: ObINotification): ObINotificationPrivate {
		return {...notification, occurrences: signal(1), $state: signal(this.getOpenState())};
	}

	private getOpenState(): string {
		const postfix = this.isPlacementOnLeft() ? '-left' : '';
		return this.notifications().length ? `in${postfix}` : `in-first${postfix}`;
	}

	private isPlacementOnLeft(): boolean {
		return [ObENotificationPlacement.BOTTOM_LEFT, ObENotificationPlacement.TOP_LEFT].includes(
			this.notificationService.placement
		);
	}

	private selfClose(notification: ObINotificationPrivate): void {
		notification.timer = this.window.setTimeout(() => {
			notification.occurrences.update(occurrences => Math.max(0, occurrences - 1));
			if (notification.occurrences() > 0) {
				this.selfClose(notification);
			} else {
				this.close(notification);
			}
		}, notification.timeout);
	}
}
