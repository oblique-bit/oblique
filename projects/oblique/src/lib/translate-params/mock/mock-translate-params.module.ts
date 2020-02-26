import {NgModule} from '@angular/core';

import {ObMockTranslateParamsPipe} from './mock-translate-params.pipe';

export {ObMockTranslateParamsPipe} from './mock-translate-params.pipe';

@NgModule({
	declarations: [ObMockTranslateParamsPipe],
	exports: [ObMockTranslateParamsPipe]
})
export class ObMockTranslateParamsModule {
}
