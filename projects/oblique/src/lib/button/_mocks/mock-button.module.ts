import {NgModule} from '@angular/core';
import {ObMockButtonDirective} from './mock-button.directive';

export {ObMockButtonDirective} from './mock-button.directive';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockButtonDirective],
	exports: [ObMockButtonDirective],
})
export class ObMockButtonModule {}
