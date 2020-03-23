import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {TranslateModule} from '@ngx-translate/core';
import {NgbDateParserFormatter, NgbDatepickerI18n, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ObDatepickerI18nService} from './datepicker-i18n.service';
import {ObDateDMYParserFormatter} from './date-parser-formatter';
import {ObDatepickerPlaceholderDirective} from './datepicker-placeholder.directive';
import {ObDateFormatterPipe} from './date-formatter.pipe';
import {ObDatepickerComponent} from './datepicker.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObThemeService} from '../theme/theme.service';
import {WINDOW, windowProvider} from '../utilities';

export {ObDatepickerI18nService} from './datepicker-i18n.service';
export {ObDateDMYParserFormatter} from './date-parser-formatter';
export {ObDatepickerPlaceholderDirective} from './datepicker-placeholder.directive';
export {ObDateFormatterPipe} from './date-formatter.pipe';
export {ObIDatepickerOptions, ObDatepickerConfigService} from './datepicker-config.service';
export {ObDatepickerComponent} from './datepicker.component';

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
		ObDatepickerComponent,
		ObDatepickerPlaceholderDirective,
		ObDateFormatterPipe
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: NgbDatepickerI18n, useClass: ObDatepickerI18nService},
		{provide: NgbDateParserFormatter, useClass: ObDateDMYParserFormatter},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [
		ObDatepickerComponent,
		ObDatepickerPlaceholderDirective,
		ObDateFormatterPipe
	]
})
export class ObDatepickerModule {
	constructor(telemetry: ObTelemetryService, theme: ObThemeService) {
		requireAndRecordTelemetry(telemetry, ObDatepickerModule);

		theme.deprecated('datepicker', 'datepicker');
	}
}
