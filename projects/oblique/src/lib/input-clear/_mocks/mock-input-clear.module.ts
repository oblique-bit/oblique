import {NgModule} from '@angular/core';

import {ObMockInputClearDirective} from './mock-input-clear.directive';

export {ObMockInputClearDirective} from './mock-input-clear.directive';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockInputClearDirective],
	exports: [ObMockInputClearDirective]
})
export class ObMockInputClearModule {}
