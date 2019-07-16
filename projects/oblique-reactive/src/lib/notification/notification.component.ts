import {Component, Input, ViewEncapsulation} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

import {INotification} from './notification.interfaces';
import {NotificationService} from './notification.service';

@Component({
	selector: 'or-notification',
	exportAs: 'orNotification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'notification-container '},
	animations: [
		trigger('inOut', [
			state('in', style({opacity: 1})),
			transition('* => in', [
				animate('650ms ease-in-out', keyframes([
					style({offset: 0, opacity: 0, 'max-height': 0, transform: 'translateX(15%)', overflow: 'hidden'}),
					style({offset: 0.6, opacity: 0, 'max-height': '500px', transform: 'translateX(15%)', overflow: 'hidden'}),
					style({offset: 1, opacity: 1, 'max-height': 'none', transform: 'translateX(0)', overflow: 'hidden'})
				]))
			]),
			state('in-first', style({opacity: 1})),
			transition('* => in-first', [
				animate('350ms ease-in-out', keyframes([
					style({offset: 0, opacity: 0, transform: 'translateX(15%)'}),
					style({offset: 1, opacity: 1, transform: 'translateX(0)'})
				]))
			]),
			state('out',
				style({opacity: 0, 'max-height': 0, overflow: 'hidden', display: 'none'})
			),
			transition('* => out', [
				animate('350ms ease-in-out', keyframes([
					style({offset: 0, opacity: 1, 'max-height': '500px', overflow: 'hidden'}),
					style({offset: 0.2, opacity: 0, 'max-height': '500px', overflow: 'hidden'}),
					style({offset: 1, opacity: 0, 'max-height': 0, overflow: 'hidden'}),
				]))
			])
		])
	]
})
export class NotificationComponent {
	public static REMOVE_DELAY = 350;
	@Input() channel: string;
	public notifications: INotification[] = [];
	public variant: { [type: string]: string } = {};

	constructor(private readonly notificationService: NotificationService) {
		this.channel = this.channel || notificationService.config.channel;

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
	public open(notification: INotification) {
		notification.$state = this.notifications.length ? 'in' : 'in-first';
		this.notifications.unshift(notification);

		if (!notification.sticky) {
			setTimeout(() => this.close(notification), notification.timeout);
		}
	}

	/**
	 * Closes & removes the specified notification.
	 *
	 * @see remove
	 */
	public close(notification) {
		notification.$state = 'out';
		setTimeout(() => this.remove(notification), NotificationComponent.REMOVE_DELAY);
	}

	/**
	 * Removes the specified notification without triggering a _close_ animation.
	 */
	public remove(notification: Notification) {
		this.notifications.splice(this.notifications.indexOf(notification), 1);
	}

	/**
	 * Closes all notifications in the current subscribed channel.
	 */
	public clear() {
		this.notifications.length = 0;
	}
}
