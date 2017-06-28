import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterBoxComponent} from './filter-box.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule
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
