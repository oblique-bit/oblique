import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {FilterBoxComponent} from './filter-box.component';
import {TextControlClearModule} from '../text-control-clear/text-control-clear.module';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule,
		TextControlClearModule
	],
	declarations: [FilterBoxComponent],
	exports: [FilterBoxComponent]
})
export class FilterBoxModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: FilterBoxModule
		};
	}
}
