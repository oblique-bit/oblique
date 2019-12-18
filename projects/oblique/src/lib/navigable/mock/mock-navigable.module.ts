import {NgModule} from '@angular/core';

import {MockNavigableGroupComponent} from './mock-navigable-group.component';
import {MockNavigableDirective} from './mock-navigable.directive';

export {MockNavigableGroupComponent} from './mock-navigable-group.component';
export {MockNavigableDirective} from './mock-navigable.directive';

@NgModule({
	declarations: [MockNavigableDirective, MockNavigableGroupComponent],
	exports: [MockNavigableDirective, MockNavigableGroupComponent]
})
export class MockNavigableModule {
}
