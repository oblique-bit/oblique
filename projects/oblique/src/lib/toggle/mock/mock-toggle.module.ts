import {NgModule} from '@angular/core';

import {MockToggleDirective} from './mock-toggle.directive';

export {MockToggleDirective} from './mock-toggle.directive';

@NgModule({
	declarations: [MockToggleDirective],
	exports: [MockToggleDirective]
})
export class MockToggleModule {
}
