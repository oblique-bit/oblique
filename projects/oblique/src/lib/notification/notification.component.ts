import {ChangeDetectorRef, Component, HostBinding, Inject, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {WINDOW} from '../utilities';
import {ObENotificationPlacement, ObINotificationPrivate} from './notification.model';
import {ObNotificationService} from './notification.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
	selector: 'ob-notification',
	exportAs: 'obNotification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss', './notification-animations.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-notification-container'},
	standalone: false
})
export class ObNotificationComponent implements OnInit, OnDestroy {
	public static REMOVE_DELAY = 350;
	@Input() channel: string;
	@HostBinding('class.ob-custom') customChannel = false;
	@HostBinding('class') get getPlacement(): ObENotificationPlacement {
		return this.notificationService.placement;
	}
	public notifications: ObINotificationPrivate[] = [];
	public variant: Record<string, string> = {};

	private readonly unsubscribe = new Subject<void>();

	constructor(
		private readonly notificationService: ObNotificationService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		@Inject(WINDOW) private readonly window: Window
	) {}

	ngOnInit(): void {
		/* eslint-disable logical-assignment-operators */
		this.channel = this.channel || this.notificationService.config.channel;
		this.customChannel = this.channel !== 'oblique';

		this.notificationService.events.pipe(takeUntil(this.unsubscribe)).subscribe(notification => {
			if (!notification || (!notification.message && notification.channel === this.channel)) {
				this.clear();
			} else if (notification.channel === this.channel) {
				this.open(notification);
			}
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	/**
	 * Adds & opens the specified notification.
	 */
	public open(notification: ObINotificationPrivate): void {
		notification.occurrences = 1;
		const existingNotification = this.notifications.find(notif => notif.idPrefix === notification.idPrefix);
		if (existingNotification && notification.groupSimilar) {
			existingNotification.occurrences++;
		} else {
			this.notifications.unshift(notification);
			notification.$state = this.getOpenState();
			if (!notification.sticky) {
				this.selfClose(notification);
			}
		}
	}

	/**
	 * Closes & removes the specified notification.
	 *
	 * @see remove
	 */
	public close(notification: ObINotificationPrivate): void {
		notification.$state = 'out';
		clearTimeout(notification.timer);
		this.window.setTimeout(() => this.remove(notification), ObNotificationComponent.REMOVE_DELAY);
	}

	/**
	 * Removes the specified notification without triggering a _close_ animation.
	 */
	public remove(notification: ObINotificationPrivate): void {
		// don't use idPrefix, because multiple notifications could share the same one
		notification.$state = 'remove';
		this.notifications = this.notifications.filter(notif => notif.$state !== 'remove');
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * Closes all notifications in the current subscribed channel.
	 */
	public clear(): void {
		this.notifications.forEach(notification => this.close(notification));
	}

	private getOpenState(): string {
		const postfix = this.isPlacementOnLeft() ? '-left' : '';
		return this.notifications.length ? `in${postfix}` : `in-first${postfix}`;
	}

	private isPlacementOnLeft(): boolean {
		return [ObENotificationPlacement.BOTTOM_LEFT, ObENotificationPlacement.TOP_LEFT].includes(this.notificationService.placement);
	}

	private selfClose(notification: ObINotificationPrivate): void {
		notification.timer = this.window.setTimeout(() => {
			notification.occurrences = Math.max(0, notification.occurrences - 1);
			if (notification.occurrences) {
				this.selfClose(notification);
			} else {
				this.close(notification);
			}
		}, notification.timeout);
	}
}
