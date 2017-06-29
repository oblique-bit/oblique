import {Component, Input} from '@angular/core';
import {Notification, NotificationType} from './notification';
import {NotificationService} from './notification.service';

@Component({
	selector: 'or-notification',
	exportAs: 'orNotification',
	template: `
		<div class="notification-container">
			<div class="notification show">
				<div class="animated slide-in-right" *ngFor="let notification of notifications"
				     [ngClass]="variant[notification.type] ">
					<button (click)="remove(notification)" [hidden]="!notification.sticky" type="button" class="close">
						&times;
					</button>
					<h4>
						<span *ngIf="!notification.title">{{("i18n.notification.type." + notification.type) | translate}}</span>
						<span>{{notification.title | translate}}</span>
					</h4>
					<p class="lead">{{notification.messageKey | translate}}</p>
				</div>
			</div>
		</div>
	`
})
export class NotificationComponent {

	@Input()
	channel: string;

	@Input()
	timeout: number;

	public notifications: Notification[] = [];

	public variant: { [type: string]: string } = {};

	constructor(private notificationService: NotificationService) {
		this.channel = this.channel || notificationService.config.channel;
		this.timeout = this.timeout || notificationService.config.timeout;

		this.variant[NotificationType.DEFAULT.name] = 'alert';
		this.variant[NotificationType.INFO.name] = 'alert alert-info';
		this.variant[NotificationType.SUCCESS.name] = 'alert alert-success';
		this.variant[NotificationType.WARNING.name] = 'alert alert-warning';
		this.variant[NotificationType.ERROR.name] = 'alert alert-danger';

		this.notificationService.events.subscribe(
			(event) => {
				if (!event || (!event.notification && event.channel === this.channel)) {
					this.clear();
				} else if (event.channel === this.channel) {
					let notification = event.notification;

					this.notifications.unshift(notification);
					this.notifications.sort((a: Notification, b: Notification) => b.type.priority - a.type.priority);

					if (!notification.sticky) {
						setTimeout(() => this.remove(notification), notification.timeout || this.timeout);
					}
				}
			}
		);
	}

	remove(notification: Notification) {
		this.notifications.forEach((item: Notification, index: number) => {
			if (notification.id === item.id) {
				this.notifications.splice(index, 1);
			}
		});
	}

	public clear() {
		// Clear the array without changing its reference:
		this.notifications.length = 0;
	}
}
