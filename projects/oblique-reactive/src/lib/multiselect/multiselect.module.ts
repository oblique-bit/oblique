import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {MultiselectComponent} from './multiselect.component';
import {MultiselectConfig} from './multiselect.config';
import {MultiselectSearchPipe} from './multiselect-search.pipe';
import {MultiselectTexts} from './multiselect.texts';
import {FilterBoxModule} from '../filter-box';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		FilterBoxModule
	],
	exports: [
		MultiselectComponent
	],
	declarations: [
		MultiselectComponent,
		MultiselectSearchPipe
	]
})
export class MultiselectModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: MultiselectModule,
			providers: [
				MultiselectConfig,
				MultiselectTexts
			]
		};
	}
}
