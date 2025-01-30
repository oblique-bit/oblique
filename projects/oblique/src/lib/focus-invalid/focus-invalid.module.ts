import {NgModule} from '@angular/core';
import {ObFocusInvalidDirective} from './focus-invalid.directive';
import {obliqueProviders} from '../utilities';

export {ObFocusInvalidDirective} from './focus-invalid.directive';

@NgModule({
	imports: [ObFocusInvalidDirective],
	providers: obliqueProviders(),
	exports: [ObFocusInvalidDirective]
})
export class ObFocusInvalidModule {}
