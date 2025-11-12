import {NgModule} from '@angular/core';
import {ObMockOptionLabelIconDirective} from '../_mocks/mock-option-label-icon.directive';
import {ObMockIconModule} from '../../icon/_mocks/mock-icon.module';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockIconModule, ObMockOptionLabelIconDirective],
	exports: [ObMockOptionLabelIconDirective],
})
export class ObMockOptionLabelIconModule {}
