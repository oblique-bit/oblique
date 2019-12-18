import {NgModule} from '@angular/core';

import {MockNavTreeFakeFocusDirective} from './mock-nav-tree-fake-focus.directive';
import {MockNavTreeComponent} from './mock-nav-tree.component';

export {MockNavTreeFakeFocusDirective} from './mock-nav-tree-fake-focus.directive';
export {MockNavTreeComponent} from './mock-nav-tree.component';

@NgModule({
	declarations: [
		MockNavTreeComponent,
		MockNavTreeFakeFocusDirective
	],
	exports: [
		MockNavTreeComponent,
		MockNavTreeFakeFocusDirective
	]
})
export class MockNavTreeModule {
}
