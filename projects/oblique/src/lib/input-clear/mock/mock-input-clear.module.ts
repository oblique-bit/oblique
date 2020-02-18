import {NgModule} from '@angular/core';

import {MockInputClearDirective} from './mock-input-clear.directive';

export {MockInputClearDirective} from './mock-input-clear.directive';

@NgModule({
	declarations: [MockInputClearDirective],
	exports: [MockInputClearDirective]
})
export class MockInputClearModule {
}
