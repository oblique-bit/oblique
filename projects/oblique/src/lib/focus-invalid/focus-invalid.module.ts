import {NgModule} from '@angular/core';
import {ObFocusInvalidDirective} from './focus-invalid.directive';
import {obliqueExports, obliqueProviders} from '../utilities';

export {ObFocusInvalidDirective} from './focus-invalid.directive';

@NgModule({
	imports: [ObFocusInvalidDirective],
	providers: obliqueProviders(),
	exports: [ObFocusInvalidDirective, ...obliqueExports]
})
export class ObFocusInvalidModule {}
