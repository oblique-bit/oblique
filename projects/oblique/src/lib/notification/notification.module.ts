import {NgModule} from '@angular/core';
import {ObNotificationComponent} from './notification.component';

export {ObNotificationComponent} from './notification.component';
export {ObNotificationService} from './notification.service';
export {
	ObNotificationConfig,
	CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE,
	GROUP_SIMILAR_NOTIFICATIONS,
} from './notification.config';
export {
	ObINotification,
	ObINotificationConfig,
	ObENotificationType,
	ObENotificationPlacement,
} from './notification.model';

@NgModule({
	imports: [ObNotificationComponent],
	exports: [ObNotificationComponent],
})
export class ObNotificationModule {}
