import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {ObNotificationComponent} from './notification.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';
import {ObAlertModule} from '../alert/alert.module';

export {ObNotificationComponent} from './notification.component';
export {ObNotificationService} from './notification.service';
export {ObNotificationConfig, CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE, GROUP_SIMILAR_NOTIFICATIONS} from './notification.config';
export {ObINotification, ObINotificationConfig, ObENotificationType, ObENotificationPlacement} from './notification.model';

@NgModule({
	imports: [CommonModule, ObAlertModule, TranslateModule],
	declarations: [ObNotificationComponent],
	providers: obliqueProviders(),
	exports: [ObNotificationComponent]
})
export class ObNotificationModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObNotificationModule);
	}
}
