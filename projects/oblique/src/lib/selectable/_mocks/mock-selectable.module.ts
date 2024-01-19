import {NgModule} from '@angular/core';
import {ObMockSelectableDirective} from './mock-selectable.directive';
import {ObMockSelectableGroupDirective} from './mock-selectable-group.directive';

export {ObMockSelectableDirective} from './mock-selectable.directive';
export {ObMockSelectableGroupDirective} from './mock-selectable-group.directive';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockSelectableDirective, ObMockSelectableGroupDirective],
	exports: [ObMockSelectableDirective, ObMockSelectableGroupDirective]
})
export class ObMockObSelectableModule {}
