import {NgModule, ModuleWithProviders} from '@angular/core';
import {DatepickerComponent} from './datepicker.component';
import {CommonModule} from '@angular/common';
import {NgbModule, NgbDatepickerI18n, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {DatepickerI18nService} from './datepicker-i18n.service';
import {DateDMYParserFormatter} from './date-parser-formatter';
import {DatepickerPlaceholderDirective} from './datepicker-placeholder.directive';
import {TranslateModule} from '@ngx-translate/core';
import {DateFormatterPipe} from './date-formatter.pipe';

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
