import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {ObNotificationComponent} from './notification.component';
import {ObNotificationService} from './notification.service';
import {ObNotificationConfig} from './notification.config';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObNotificationComponent} from './notification.component';
export {ObNotificationService} from './notification.service';
export {ObNotificationConfig, CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE, GROUP_SIMILAR_NOTIFICATIONS} from './notification.config';
export {ObINotification, ObINotificationConfig, ObENotificationType} from './notification.interfaces';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [ObNotificationComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObNotificationComponent]
})
export class ObNotificationModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObNotificationModule);
	}
}
