import {NgModule} from '@angular/core';

import {ObMockNavigableGroupComponent} from './mock-navigable-group.component';
import {ObMockNavigableDirective} from './mock-navigable.directive';

export {ObMockNavigableGroupComponent} from './mock-navigable-group.component';
export {ObMockNavigableDirective} from './mock-navigable.directive';

@NgModule({
	declarations: [ObMockNavigableDirective, ObMockNavigableGroupComponent],
	exports: [ObMockNavigableDirective, ObMockNavigableGroupComponent]
})
export class ObMockNavigableModule {}
