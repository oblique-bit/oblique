import {NgModule} from '@angular/core';

import {MockFormControlStateDirective} from './mock-form-control-state.directive';

export {MockFormControlStateDirective} from './mock-form-control-state.directive';

@NgModule({
	declarations: [MockFormControlStateDirective],
	exports: [MockFormControlStateDirective]
})
export class MockFormControlStateModule {
}
