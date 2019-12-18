import {NgModule} from '@angular/core';

import {NotificationConfig, NotificationService} from '../notification.module';
import {MockNotificationComponent} from './mock-notification.component';
import {MockNotificationService} from './mock-notification.service';
import {MockNotificationConfig} from './mock-notification.config';

export {MockNotificationComponent} from './mock-notification.component';
export {MockNotificationService} from './mock-notification.service';
export {MockNotificationConfig} from './mock-notification.config';

@NgModule({
	declarations: [MockNotificationComponent],
	exports: [MockNotificationComponent],
	providers: [
		{provide: NotificationService, useClass: MockNotificationService},
		{provide: NotificationConfig, useClass: MockNotificationConfig}
	]
})
export class MockNotificationModule {
}
