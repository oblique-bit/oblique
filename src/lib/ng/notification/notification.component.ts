import {Component} from '@angular/core';
import {Notification, NotificationTypes} from './notification';
import {NotificationService} from './notification.service';

@Component({
	//TODO: discuss prefix
	selector: 'or-notification',
	template: `
      <div class="notification-container">
          <div class="notification show">
              <div class="animated slide-in-right" *ngFor="let notification of notifications" [ngClass]="alertType[notification.type] ">
                  <button (click)="remove(notification)" [hidden]="!notification.sticky" type="button" class="close">&times;</button>
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

	public notifications: Notification[];

	public alertType: {[type: string]: string} = {};

	constructor(private notificationService: NotificationService) {
		this.alertType[NotificationTypes.DEFAULT.name] = 'alert';
		this.alertType[NotificationTypes.INFO.name] = 'alert alert-info';
		this.alertType[NotificationTypes.SUCCESS.name] = 'alert alert-success';
		this.alertType[NotificationTypes.WARNING.name] = 'alert alert-warning';
		this.alertType[NotificationTypes.ERROR.name] = 'alert alert-danger';

		this.notifications = notificationService.notifications;
	}

	remove(notification: Notification) {
		this.notificationService.remove(notification.id);
	}

}
