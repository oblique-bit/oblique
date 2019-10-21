import {NgModule} from '@angular/core';
import {MockMultiselectComponent} from './mock-multiselect.component';
import {MockMultiselectSearchPipe} from './mock-multiselect-search.pipe';
import {MockMultiselectConfig} from './mock-multiselect.config';
import {MockMultiselectTexts} from './mock-multiselect.texts';
import {MultiselectConfig, MultiselectTexts} from '../multiselect.module';

export {MockMultiselectComponent} from './mock-multiselect.component';
export {MockMultiselectSearchPipe} from './mock-multiselect-search.pipe';
export {MockMultiselectConfig} from './mock-multiselect.config';
export {MockMultiselectTexts} from './mock-multiselect.texts';

@NgModule({
	declarations: [
		MockMultiselectComponent,
		MockMultiselectSearchPipe
	],
	exports: [
		MockMultiselectComponent,
		MockMultiselectSearchPipe
	],
	providers: [
		{provide: MultiselectConfig, useClass: MockMultiselectConfig},
		{provide: MultiselectTexts, useClass: MockMultiselectTexts}
	]
})
export class MockMultiselectModule {
}
