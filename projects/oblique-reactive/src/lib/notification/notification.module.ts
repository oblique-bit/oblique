import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {NotificationComponent} from './notification.component';
import {NotificationService} from './notification.service';
import {NotificationConfig} from './notification.config';

export {NotificationComponent} from './notification.component';
export {NotificationService} from './notification.service';
export {NotificationConfig} from './notification.config';
export {INotification, KeyWithParams, Notification, NotificationEvent, NotificationType} from './notification.interfaces';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [NotificationComponent],
	exports: [NotificationComponent]
})
export class NotificationModule {
}
