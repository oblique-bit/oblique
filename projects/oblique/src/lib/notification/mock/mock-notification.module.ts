import {NgModule} from '@angular/core';

import {ObNotificationConfig, ObNotificationService} from '../notification.module';
import {ObMockNotificationComponent} from './mock-notification.component';
import {ObMockNotificationService} from './mock-notification.service';
import {ObMockNotificationConfig} from './mock-notification.config';

export {ObMockNotificationComponent} from './mock-notification.component';
export {ObMockNotificationService} from './mock-notification.service';
export {ObMockNotificationConfig} from './mock-notification.config';

@NgModule({
	declarations: [ObMockNotificationComponent],
	exports: [ObMockNotificationComponent],
	providers: [
		{provide: ObNotificationService, useClass: ObMockNotificationService},
		{provide: ObNotificationConfig, useClass: ObMockNotificationConfig}
	]
})
export class ObMockNotificationModule {}
