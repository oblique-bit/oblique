import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {FilterBoxModule} from '../filter-box/filter-box.module';
import {MultiselectComponent} from './multiselect.component';
import {MultiselectConfig} from './multiselect.config';
import {MultiselectSearchPipe} from './multiselect-search.pipe';
import {MultiselectTexts} from './multiselect.texts';

export {MultiselectComponent} from './multiselect.component';
export {MultiselectConfig} from './multiselect.config';
export {MultiselectSearchPipe} from './multiselect-search.pipe';
export {MultiselectTexts} from './multiselect.texts';

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
}
