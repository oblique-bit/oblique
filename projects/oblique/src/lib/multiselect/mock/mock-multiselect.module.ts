import {NgModule} from '@angular/core';
import {ObMockMultiselectComponent} from './mock-multiselect.component';
import {ObMockMultiselectSearchPipe} from './mock-multiselect-search.pipe';
import {ObMockMultiselectConfig} from './mock-multiselect.config';
import {ObMockMultiselectTexts} from './mock-multiselect.texts';
import {ObMultiselectConfig, ObMultiselectTexts} from '../multiselect.module';

export {ObMockMultiselectComponent} from './mock-multiselect.component';
export {ObMockMultiselectSearchPipe} from './mock-multiselect-search.pipe';
export {ObMockMultiselectConfig} from './mock-multiselect.config';
export {ObMockMultiselectTexts} from './mock-multiselect.texts';

@NgModule({
	declarations: [ObMockMultiselectComponent, ObMockMultiselectSearchPipe],
	exports: [ObMockMultiselectComponent, ObMockMultiselectSearchPipe],
	providers: [
		{provide: ObMultiselectConfig, useClass: ObMockMultiselectConfig},
		{provide: ObMultiselectTexts, useClass: ObMockMultiselectTexts}
	]
})
export class ObMockMultiselectModule {}
