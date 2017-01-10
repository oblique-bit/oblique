import { Component } from '@angular/core';
import { Notification, NotificationTypes } from './notification';
import { NotificationService } from './notification.service';

@Component({
  //TODO: discuss prefix
  selector: 'oblique-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent {

  public notifications : Notification[];

  public alertType : {[type : string] : string}= {};

  constructor(private notificationService : NotificationService) {
    this.alertType[NotificationTypes.DEFAULT.name] = 'alert';
    this.alertType[NotificationTypes.INFO.name] = 'alert alert-info';
    this.alertType[NotificationTypes.SUCCESS.name] = 'alert alert-success';
    this.alertType[NotificationTypes.WARNING.name] = 'alert alert-warning';
    this.alertType[NotificationTypes.ERROR.name] = 'alert alert-danger';

    this.notifications = notificationService.notifications;
  }

  remove(notification : Notification) {
    this.notificationService.remove(notification.id);
  }

}
