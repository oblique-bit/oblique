import {NgModule} from '@angular/core';

import {ObNotificationConfig, ObNotificationService} from '../notification.module';
import {ObMockNotificationComponent} from './mock-notification.component';
import {ObMockNotificationService} from './mock-notification.service';
import {ObMockNotificationConfig} from './mock-notification.config';

export {ObMockNotificationComponent} from './mock-notification.component';
export {ObMockNotificationService} from './mock-notification.service';
export {ObMockNotificationConfig} from './mock-notification.config';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	declarations: [ObMockNotificationComponent],
	providers: [
		{provide: ObNotificationService, useClass: ObMockNotificationService},
		{provide: ObNotificationConfig, useClass: ObMockNotificationConfig},
	],
	exports: [ObMockNotificationComponent],
})
export class ObMockNotificationModule {}
