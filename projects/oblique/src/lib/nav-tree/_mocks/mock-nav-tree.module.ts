import {NgModule} from '@angular/core';

import {ObMockNavTreeFakeFocusDirective} from './mock-nav-tree-fake-focus.directive';
import {ObMockNavTreeComponent} from './mock-nav-tree.component';

export {ObMockNavTreeFakeFocusDirective} from './mock-nav-tree-fake-focus.directive';
export {ObMockNavTreeComponent} from './mock-nav-tree.component';

@NgModule({
	declarations: [ObMockNavTreeComponent, ObMockNavTreeFakeFocusDirective],
	exports: [ObMockNavTreeComponent, ObMockNavTreeFakeFocusDirective]
})
export class ObMockNavTreeModule {}
