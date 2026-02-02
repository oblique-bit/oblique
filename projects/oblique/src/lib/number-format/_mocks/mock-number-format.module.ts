import {NgModule} from '@angular/core';
import {ObMockNumberFormatDirective} from './mock-number-format.directive';

export {ObMockNumberFormatDirective} from './mock-number-format.directive';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockNumberFormatDirective],
	exports: [ObMockNumberFormatDirective],
})
export class ObMockNumberFormatModule {}
