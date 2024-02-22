import {NgModule} from '@angular/core';

import {ObMockTranslateParamsPipe} from './mock-translate-params.pipe';

export {ObMockTranslateParamsPipe} from './mock-translate-params.pipe';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockTranslateParamsPipe],
	exports: [ObMockTranslateParamsPipe]
})
export class ObMockTranslateParamsModule {}
