import {NgModule} from '@angular/core';

import {MockTextControlClearDirective} from './mock-text-control-clear.directive';

export {MockTextControlClearDirective} from './mock-text-control-clear.directive';

@NgModule({
	declarations: [MockTextControlClearDirective],
	exports: [MockTextControlClearDirective]
})
export class MockTextControlClearModule {
}
