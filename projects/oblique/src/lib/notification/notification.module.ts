import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

import {NotificationComponent} from './notification.component';
import {NotificationService} from './notification.service';
import {NotificationConfig} from './notification.config';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {NotificationComponent} from './notification.component';
export {NotificationService} from './notification.service';
export {NotificationConfig, CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE, GROUP_SIMILAR_NOTIFICATIONS} from './notification.config';
export {KeyWithParams, INotification, NotificationType} from './notification.interfaces';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [NotificationComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [NotificationComponent]
})
export class NotificationModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, NotificationModule);
	}
}
