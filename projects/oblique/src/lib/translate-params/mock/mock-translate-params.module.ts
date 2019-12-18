import {NgModule} from '@angular/core';

import {MockTranslateParamsPipe} from './mock-translate-params.pipe';

export {MockTranslateParamsPipe} from './mock-translate-params.pipe';

@NgModule({
	declarations: [MockTranslateParamsPipe],
	exports: [MockTranslateParamsPipe]
})
export class MockTranslateParamsModule {
}
