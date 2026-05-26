import {NgModule} from '@angular/core';
import {ObMockPopoverDirective} from './mock-popover.directive';

export {ObMockPopoverDirective} from './mock-popover.directive';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockPopoverDirective],
	exports: [ObMockPopoverDirective],
})
export class ObMockPopoverModule {}
