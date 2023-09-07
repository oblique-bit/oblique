import {NgModule} from '@angular/core';

import {ObInputClearDirective} from './input-clear.directive';
import {obliqueProviders} from '../utilities';

export {ObInputClearDirective} from './input-clear.directive';

@NgModule({
	imports: [ObInputClearDirective],
	providers: obliqueProviders(),
	exports: [ObInputClearDirective]
})
export class ObInputClearModule {}
