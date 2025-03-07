import {NgModule} from '@angular/core';
import {ObPopoverDirective} from './popover.directive';

export {ObPopoverDirective, OBLIQUE_POPOVER_TOGGLE_HANDLE, OBLIQUE_POPOVER_CLOSE_ONLY_ON_TOGGLE} from './popover.directive';
export {ObEToggleType} from './popover.model';

@NgModule({
	imports: [ObPopoverDirective],
	exports: [ObPopoverDirective]
})
export class ObPopoverModule {}
