import {Component, Input} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

import {Notification, NotificationType} from './notification';
import {NotificationService} from './notification.service';


@Component({
	selector: 'or-notification',
	exportAs: 'orNotification',
	template: `
		<div class="notification-container">
			<div class="notification show"
			     *ngFor="let notification of notifications"
			     [@inOut]="notification.$state">
				<div [ngClass]="variant[notification.type]">
					<button (click)="close(notification)" type="button" class="close">
						&times;
					</button>
					<h4>
						<span *ngIf="!notification.titleKey">{{("i18n.notification.type." + notification.type) | translate}}</span>
						<span>{{notification.titleKey | translate:notification.titleParams}}</span>
					</h4>
					<p>{{notification.messageKey | translate:notification.messageParams}}</p>
				</div>
			</div>
		</div>
	`,
	styles: [`
		.notification-container {
			perspective: 80px;
		}
	`],
	animations: [
		trigger('inOut', [
			state('in', style({opacity: 1})),
			transition('* => in', [
				animate('650ms ease-in-out', keyframes([
					style({offset: 0,   opacity: 0, 'max-height': 0,        transform: 'translateX(15%)',   overflow: 'hidden'}),
					style({offset: 0.6, opacity: 0, 'max-height': '500px',  transform: 'translateX(15%)',   overflow: 'hidden'}),
					style({offset: 1,   opacity: 1, 'max-height': 'none',   transform: 'translateX(0)',     overflow: 'hidden'})
				]))
			]),
			state('in-first', style({opacity: 1})),
			transition('* => in-first', [
				animate('350ms ease-in-out', keyframes([
					style({offset: 0,   opacity: 0, transform: 'translateX(15%)'}),
					style({offset: 1,   opacity: 1, transform: 'translateX(0)'})
				]))
			]),
			state('out',
				style({opacity: 0, 'max-height': 0, overflow: 'hidden', display: 'none'})
			),
			transition('* => out', [
				animate('350ms ease-in-out', keyframes([
					style({offset: 0,   opacity: 1, 'max-height': '500px',  overflow: 'hidden'}),
					style({offset: 0.2, opacity: 0, 'max-height': '500px',  overflow: 'hidden'}),
					style({offset: 1,   opacity: 0, 'max-height': 0,        overflow: 'hidden'}),
				]))
			])
		])
	]
})
export class NotificationComponent {

	public static ANIMATION_OUT_DURATION = 350;

	@Input()
	channel: string;

	@Input()
	timeout: number;

	public notifications: Notification[] = [];

	public variant: { [type: string]: string } = {};

	constructor(private readonly notificationService: NotificationService) {
		this.channel = this.channel || notificationService.config.channel;
		this.timeout = this.timeout || notificationService.config.timeout;

		this.variant[NotificationType.DEFAULT.name] = 'alert alert-default';
		this.variant[NotificationType.INFO.name] = 'alert alert-info';
		this.variant[NotificationType.SUCCESS.name] = 'alert alert-success';
		this.variant[NotificationType.WARNING.name] = 'alert alert-warning';
		this.variant[NotificationType.ERROR.name] = 'alert alert-danger';

		this.notificationService.events.subscribe(
			(event) => {
				if (!event || (!event.notification && event.channel === this.channel)) {
					this.clear();
				} else if (event.channel === this.channel) {
					this.open(event.notification);
				}
			}
		);
	}

	// Public API:
	// ---------------------------------

	/**
	 * Adds & opens the specified notification.
	 *
	 * @param notification
	 */
	public open(notification) {

		// Prepare for enter animation:
		notification.$state = this.notifications.length ? 'in' : 'in-first';

		// Append notification to inbox:
		this.notifications.unshift(notification);

		// TODO: should we really sort notifications?
		this.notifications.sort((a: Notification, b: Notification) => b.type.priority - a.type.priority);

		if (!notification.sticky) {
			setTimeout(() => this.close(notification), notification.timeout || this.timeout);
		}
	}

	/**
	 * Closes & removes the specified notification.
	 *
	 * @see remove
	 * @param notification
	 */
	public close(notification) {
		// Start close animation:
		notification.$state = 'out';

		// Remove element after close:
		setTimeout(() => this.remove(notification), NotificationComponent.ANIMATION_OUT_DURATION);
	}

	/**
	 * Removes the specified notification without triggering a _close_ animation.
	 *
	 * @param {Notification} notification
	 */
	public remove(notification: Notification) {
		this.notifications.splice(this.notifications.indexOf(notification), 1);
	}

	/**
	 * Closes all notifications in the current subscribed channel.
	 */
	public clear() {
		// Clear the array without changing its reference:
		this.notifications.length = 0;
	}
}
