import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {FilterBoxComponent} from './filter-box.component';

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
