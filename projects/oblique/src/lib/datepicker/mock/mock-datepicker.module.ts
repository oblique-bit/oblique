import {NgModule} from '@angular/core';
import {MockDateFormatterPipe} from './mock-date-formatter.pipe';
import {MockDatepickerPlaceholderDirective} from './mock-datepicker-placeholder.directive';
import {DatepickerI18nService} from '../datepicker-i18n.service';
import {MockDatepickerI18nService} from './mock-datepicker-i18n.service';
import {MockDatepickerComponent} from './mock-datepicker.component';

export {MockDateFormatterPipe} from './mock-date-formatter.pipe';
export {MockDatepickerPlaceholderDirective} from './mock-datepicker-placeholder.directive';
export {MockDatepickerComponent} from './mock-datepicker.component';

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
		{provide: DatepickerI18nService, useClass: MockDatepickerI18nService}
	]
})
export class MockDatepickerModule {
}
