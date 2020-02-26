import {NgModule} from '@angular/core';

import {ObMockInputClearDirective} from './mock-input-clear.directive';

export {ObMockInputClearDirective} from './mock-input-clear.directive';

@NgModule({
	declarations: [ObMockInputClearDirective],
	exports: [ObMockInputClearDirective]
})
export class ObMockInputClearModule {
}
