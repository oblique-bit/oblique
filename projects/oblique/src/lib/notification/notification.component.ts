import {Component, HostBinding, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

import {ObINotification} from './notification.interfaces';
import {ObNotificationService} from './notification.service';

@Component({
	selector: 'ob-notification',
	exportAs: 'obNotification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'notification-container'},
	animations: [
		trigger('inOut', [
			state('in', style({opacity: 1})),
			transition('* => in', [
				animate('650ms ease-in-out', keyframes([
					style({offset: 0, opacity: 0,  maxHeight: 0, transform: 'translateX({{translateX}})', overflow: 'hidden'}),
					style({offset: 0.6, opacity: 0, maxHeight: '500px', transform: 'translateX({{translateX}})', overflow: 'hidden'}),
					style({offset: 1, opacity: 1, maxHeight: 'none', transform: 'translateX(0)', overflow: 'hidden'})
				]))
			], {params : { translateX: '15%' }}),
			state('in-first', style({opacity: 1})),
			transition('* => in-first', [
				animate('350ms ease-in-out', keyframes([
					style({offset: 0, opacity: 0, transform: 'translateX(15%)'}),
					style({offset: 1, opacity: 1, transform: 'translateX(0)'})
				]))
			]),
			state('out',
				style({opacity: 0, maxHeight: 0, overflow: 'hidden', display: 'none'})
			),
			transition('* => out', [
				animate('350ms ease-in-out', keyframes([
					style({offset: 0, opacity: 1, maxHeight: '500px', overflow: 'hidden'}),
					style({offset: 0.2, opacity: 0, maxHeight: '500px', overflow: 'hidden'}),
					style({offset: 1, opacity: 0, maxHeight: 0, overflow: 'hidden'}),
				]))
			])
		])
	]
})
export class ObNotificationComponent implements OnInit {
	public static REMOVE_DELAY = 350;
	@Input() channel: string;
	@HostBinding('class.custom') customChannel = false;
	public notifications: ObINotification[] = [];
	public variant: { [type: string]: string } = {};

	constructor(private readonly notificationService: ObNotificationService) {
	}

	ngOnInit(): void {
		this.channel = this.channel || this.notificationService.config.channel;
		this.customChannel = this.channel !== 'oblique';

		this.notificationService.events.subscribe(
			(notification) => {
				if (!notification || (!notification.message && notification.channel === this.channel)) {
					this.clear();
				} else if (notification.channel === this.channel) {
					this.open(notification);
				}
			}
		);
	}

	/**
	 * Adds & opens the specified notification.
	 */
	public open(notification: ObINotification): void {
		notification.occurrences = 1;
		const existingNotification = this.notifications.find((notif) => notif.idPrefix === notification.idPrefix);
		if (existingNotification && notification.groupSimilar) {
			existingNotification.occurrences++;
		} else {
			this.notifications.unshift(notification);
			notification.$state = this.notifications.length ? 'in' : 'in-first';
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
	public close(notification): void {
		notification.$state = 'out';
		clearTimeout(notification.timer);
		setTimeout(() => this.remove(notification), ObNotificationComponent.REMOVE_DELAY);
	}

	/**
	 * Removes the specified notification without triggering a _close_ animation.
	 */
	public remove(notification: Notification): void {
		this.notifications.splice(this.notifications.indexOf(notification), 1);
	}

	/**
	 * Closes all notifications in the current subscribed channel.
	 */
	public clear(): void {
		this.notifications.length = 0;
	}

	private selfClose(notification: ObINotification): void {
		notification.timer = setTimeout(() => {
			if (notification.occurrences) {
				notification.occurrences--;
				this.selfClose(notification);
			} else {
				this.close(notification);
			}
		}, notification.timeout);
	}
}
