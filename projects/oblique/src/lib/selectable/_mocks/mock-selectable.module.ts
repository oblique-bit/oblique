import {NgModule} from '@angular/core';
import {ObMockSelectableDirective} from './mock-selectable.directive';
import {ObMockSelectableGroupDirective} from './mock-selectable-group.directive';

export {ObMockSelectableDirective} from './mock-selectable.directive';
export {ObMockSelectableGroupDirective} from './mock-selectable-group.directive';

@NgModule({
	declarations: [ObMockSelectableDirective, ObMockSelectableGroupDirective],
	exports: [ObMockSelectableDirective, ObMockSelectableGroupDirective]
})
export class ObMockObSelectableModule {}
