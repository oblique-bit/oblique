import {NgModule} from '@angular/core';

import {ObNumberFormatDirective} from './number-format.directive';
import {obliqueProviders} from '../utilities';

export {ObNumberFormatDirective} from './number-format.directive';

@NgModule({
	imports: [ObNumberFormatDirective],
	providers: obliqueProviders(),
	exports: [ObNumberFormatDirective]
})
export class ObNumberFormatModule {}
