import {NgModule} from '@angular/core';

import {ObInputClearDirective} from './input-clear.directive';
import {obliqueExports, obliqueProviders} from '../utilities';

export {ObInputClearDirective} from './input-clear.directive';

@NgModule({
	imports: [ObInputClearDirective],
	providers: obliqueProviders(),
	exports: [ObInputClearDirective, ...obliqueExports]
})
export class ObInputClearModule {}
