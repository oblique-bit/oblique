import {NgModule} from '@angular/core';
import {ObFocusInvalidDirective} from './focus-invalid.directive';

export {ObFocusInvalidDirective} from './focus-invalid.directive';

@NgModule({
	imports: [ObFocusInvalidDirective],
	exports: [ObFocusInvalidDirective]
})
export class ObFocusInvalidModule {}
