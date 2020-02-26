import {NgModule} from '@angular/core';
import {ObDatepickerI18nService} from '../datepicker-i18n.service';
import {ObDatepickerConfigService} from '../datepicker-config.service';
import {ObMockDateFormatterPipe} from './mock-date-formatter.pipe';
import {ObMockDatepickerPlaceholderDirective} from './mock-datepicker-placeholder.directive';
import {ObMockDatepickerI18nService} from './mock-datepicker-i18n.service';
import {ObMockDatepickerComponent} from './mock-datepicker.component';
import {ObMockDatepickerConfigService} from './mock-datepicker-config.service';

export {ObMockDateFormatterPipe} from './mock-date-formatter.pipe';
export {ObMockDatepickerPlaceholderDirective} from './mock-datepicker-placeholder.directive';
export {ObMockDatepickerComponent} from './mock-datepicker.component';
export {ObMockDatepickerI18nService} from './mock-datepicker-i18n.service';
export {ObMockDatepickerConfigService} from './mock-datepicker-config.service';

@NgModule({
	declarations: [
		ObMockDateFormatterPipe,
		ObMockDatepickerPlaceholderDirective,
		ObMockDatepickerComponent
	],
	exports: [
		ObMockDateFormatterPipe,
		ObMockDatepickerPlaceholderDirective,
		ObMockDatepickerComponent
	],
	providers: [
		{provide: ObDatepickerI18nService, useClass: ObMockDatepickerI18nService},
		{provide: ObDatepickerConfigService, useClass: ObMockDatepickerConfigService},
	]
})
export class ObMockDatepickerModule {
}
