import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {TranslateModule} from '@ngx-translate/core';
import {NgbDateParserFormatter, NgbDatepickerI18n, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {DatepickerI18nService} from './datepicker-i18n.service';
import {DateDMYParserFormatter} from './date-parser-formatter';
import {DatepickerPlaceholderDirective} from './datepicker-placeholder.directive';
import {DateFormatterPipe} from './date-formatter.pipe';
import {DatepickerComponent} from './datepicker.component';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ThemeService} from '../theme/theme.service';
import {WINDOW, windowProvider} from '../utilities';

export {DatepickerI18nService} from './datepicker-i18n.service';
export {DateDMYParserFormatter} from './date-parser-formatter';
export {DatepickerPlaceholderDirective} from './datepicker-placeholder.directive';
export {DateFormatterPipe} from './date-formatter.pipe';
export {DatepickerOptions, DatepickerConfigService} from './datepicker-config.service';
export {DatepickerComponent} from './datepicker.component';

/**
 * @deprecated with material theme since version 4.0.0. Use angular material datepicker instead
 */
@NgModule({
	imports: [
		CommonModule,
		NgbModule,
		TranslateModule,
		ReactiveFormsModule
	],
	declarations: [
		DatepickerComponent,
		DatepickerPlaceholderDirective,
		DateFormatterPipe
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: NgbDatepickerI18n, useClass: DatepickerI18nService},
		{provide: NgbDateParserFormatter, useClass: DateDMYParserFormatter},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [
		DatepickerComponent,
		DatepickerPlaceholderDirective,
		DateFormatterPipe
	]
})
export class DatepickerModule {
	constructor(telemetry: TelemetryService, theme: ThemeService) {
		requireAndRecordTelemetry(telemetry, DatepickerModule);

		theme.deprecated('datepicker', 'datepicker');
	}
}
