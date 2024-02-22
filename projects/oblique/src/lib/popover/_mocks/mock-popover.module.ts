import {NgModule} from '@angular/core';
import {ObMockPopoverDirective} from './mock-popover.directive';

export {ObMockPopoverDirective} from './mock-popover.directive';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockPopoverDirective],
	exports: [ObMockPopoverDirective]
})
export class ObMockPopoverModule {}
