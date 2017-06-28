import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilterBoxComponent} from './filter-box.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {PatternFilterPipe} from '../../../showcase/app/samples/filter-box-sample/filter-box-sample.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule
	],
	declarations: [FilterBoxComponent, PatternFilterPipe],
	exports: [FilterBoxComponent, PatternFilterPipe]
})
export class FilterBoxModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: FilterBoxModule
		};
	}
}
