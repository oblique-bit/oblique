import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule, NgbDatepickerI18n, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import {DatepickerI18nService} from './datepicker-i18n.service';
import {DateDMYParserFormatter} from './date-parser-formatter';
import {DatepickerPlaceholderDirective} from './datepicker-placeholder.directive';
import {DateFormatterPipe} from './date-formatter.pipe';
import {DatepickerComponent} from './datepicker.component';

export {DatepickerI18nService} from './datepicker-i18n.service';
export {DateDMYParserFormatter} from './date-parser-formatter';
export {DatepickerPlaceholderDirective} from './datepicker-placeholder.directive';
export {DateFormatterPipe} from './date-formatter.pipe';
export {DatepickerComponent} from './datepicker.component';

@NgModule({
	imports: [
		CommonModule,
		NgbModule,
		FormsModule,
		TranslateModule
	],
	declarations: [
		DatepickerComponent,
		DatepickerPlaceholderDirective,
		DateFormatterPipe
	],
	exports: [
		DatepickerComponent,
		DatepickerPlaceholderDirective,
		DateFormatterPipe
	]
})
export class DatepickerModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: DatepickerModule,
			providers: [
				{provide: NgbDatepickerI18n, useClass: DatepickerI18nService},
				{provide: NgbDateParserFormatter, useClass: DateDMYParserFormatter}
			]
		};
	}
}
