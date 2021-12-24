import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgbDateParserFormatter, NgbDatepickerI18n, NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {ObDatepickerI18nService} from './datepicker-i18n.service';
import {ObDateDMYParserFormatter} from './date-parser-formatter';
import {ObDatepickerPlaceholderDirective} from './datepicker-placeholder.directive';
import {ObDateFormatterPipe} from './date-formatter.pipe';
import {ObDatepickerComponent} from './datepicker.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObThemeService} from '../theme.service';
import {obliqueProviders} from '../utilities';

export {ObDatepickerI18nService} from './datepicker-i18n.service';
export {ObDateDMYParserFormatter} from './date-parser-formatter';
export {ObDatepickerPlaceholderDirective} from './datepicker-placeholder.directive';
export {ObDateFormatterPipe} from './date-formatter.pipe';
export {ObDatepickerConfigService} from './datepicker-config.service';
export {ObDatepickerComponent} from './datepicker.component';
export {ObIDatepickerOptions} from './datepicker.model';

/**
 * @deprecated with material theme since version 4.0.0. Use angular material datepicker instead.
 * Deprecated with bootstrap theme since version 8.0.0. Will be removed with version 10.0.0.
 */
@NgModule({
	imports: [CommonModule, NgbModule, TranslateModule, ReactiveFormsModule],
	declarations: [ObDatepickerComponent, ObDatepickerPlaceholderDirective, ObDateFormatterPipe],
	providers: [
		...obliqueProviders(),
		{provide: NgbDatepickerI18n, useClass: ObDatepickerI18nService},
		{provide: NgbDateParserFormatter, useClass: ObDateDMYParserFormatter}
	],
	exports: [ObDatepickerComponent, ObDatepickerPlaceholderDirective, ObDateFormatterPipe]
})
export class ObDatepickerModule {
	constructor(telemetry: ObTelemetryService, theme: ObThemeService) {
		requireAndRecordTelemetry(telemetry, ObDatepickerModule);

		theme.deprecated('datepicker', 'datepicker');
	}
}
