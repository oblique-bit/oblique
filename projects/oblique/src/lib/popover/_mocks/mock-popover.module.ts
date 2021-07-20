import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ObMockPopoverDirective} from './mock-popover.directive';

export {ObMockPopoverDirective} from './mock-popover.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ObMockPopoverDirective],
	exports: [ObMockPopoverDirective]
})
export class ObMockPopoverModule {}
