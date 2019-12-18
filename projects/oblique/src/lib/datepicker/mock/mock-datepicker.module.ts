import {NgModule} from '@angular/core';
import {DatepickerI18nService} from '../datepicker-i18n.service';
import {DatepickerConfigService} from '../datepicker-config.service';
import {MockDateFormatterPipe} from './mock-date-formatter.pipe';
import {MockDatepickerPlaceholderDirective} from './mock-datepicker-placeholder.directive';
import {MockDatepickerI18nService} from './mock-datepicker-i18n.service';
import {MockDatepickerComponent} from './mock-datepicker.component';
import {MockDatepickerConfigService} from './mock-datepicker-config.service';

export {MockDateFormatterPipe} from './mock-date-formatter.pipe';
export {MockDatepickerPlaceholderDirective} from './mock-datepicker-placeholder.directive';
export {MockDatepickerComponent} from './mock-datepicker.component';
export {MockDatepickerI18nService} from './mock-datepicker-i18n.service';
export {MockDatepickerConfigService} from './mock-datepicker-config.service';

@NgModule({
	declarations: [
		MockDateFormatterPipe,
		MockDatepickerPlaceholderDirective,
		MockDatepickerComponent
	],
	exports: [
		MockDateFormatterPipe,
		MockDatepickerPlaceholderDirective,
		MockDatepickerComponent
	],
	providers: [
		{provide: DatepickerI18nService, useClass: MockDatepickerI18nService},
		{provide: DatepickerConfigService, useClass: MockDatepickerConfigService},
	]
})
export class MockDatepickerModule {
}
