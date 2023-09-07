import {NgModule} from '@angular/core';
import {ObMockNumberFormatDirective} from './mock-number-format.directive';

export {ObMockNumberFormatDirective} from './mock-number-format.directive';

@NgModule({
	imports: [ObMockNumberFormatDirective],
	exports: [ObMockNumberFormatDirective]
})
export class ObMockNumberFormatModule {}
