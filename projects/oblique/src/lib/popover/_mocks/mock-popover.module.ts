import {NgModule} from '@angular/core';
import {ObMockPopoverDirective} from './mock-popover.directive';

export {ObMockPopoverDirective} from './mock-popover.directive';

@NgModule({
	imports: [ObMockPopoverDirective],
	exports: [ObMockPopoverDirective]
})
export class ObMockPopoverModule {}
