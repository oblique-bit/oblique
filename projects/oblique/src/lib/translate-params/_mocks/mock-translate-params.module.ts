import {NgModule} from '@angular/core';

import {ObMockTranslateParamsPipe} from './mock-translate-params.pipe';

export {ObMockTranslateParamsPipe} from './mock-translate-params.pipe';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockTranslateParamsPipe],
	exports: [ObMockTranslateParamsPipe],
})
export class ObMockTranslateParamsModule {}
