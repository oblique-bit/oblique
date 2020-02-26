import {NgModule} from '@angular/core';

import {ObMockToggleDirective} from './mock-toggle.directive';

export {ObMockToggleDirective} from './mock-toggle.directive';

@NgModule({
	declarations: [ObMockToggleDirective],
	exports: [ObMockToggleDirective]
})
export class ObMockToggleModule {
}
