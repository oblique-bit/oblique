import {NgModule, ModuleWithProviders} from '@angular/core';
import {DatepickerComponent} from './datepicker.component';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';

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
			ngModule: DatepickerModule
		};
	}
}
