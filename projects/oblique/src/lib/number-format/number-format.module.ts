import {NgModule} from '@angular/core';

import {ObNumberFormatDirective} from './number-format.directive';

export {ObNumberFormatDirective} from './number-format.directive';

@NgModule({
	imports: [ObNumberFormatDirective],
	exports: [ObNumberFormatDirective]
})
export class ObNumberFormatModule {}
