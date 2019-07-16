import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {NotificationComponent} from './notification.component';
import {NotificationService} from './notification.service';
import {NotificationConfig} from './notification.config';

export {NotificationComponent} from './notification.component';
export {NotificationService} from './notification.service';
export {NotificationConfig} from './notification.config';
export {KeyWithParams, INotification, NotificationType} from './notification.interfaces';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [NotificationComponent],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [NotificationComponent]
})
export class NotificationModule {
}
