import {NgModule, ModuleWithProviders} from '@angular/core';
import {DatepickerComponent} from './datepicker.component';
import {CommonModule} from '@angular/common';
import {NgbModule, NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {DatepickerI18nService} from './datepicker-i18n.service';

@NgModule({
	imports: [
		CommonModule,
		NgbModule,
		FormsModule
	],
	declarations: [DatepickerComponent],
	exports: [DatepickerComponent]
})
export class DatepickerModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: DatepickerModule,
			providers: [
				{provide: NgbDatepickerI18n, useClass: DatepickerI18nService}
			]
		};
	}
}
