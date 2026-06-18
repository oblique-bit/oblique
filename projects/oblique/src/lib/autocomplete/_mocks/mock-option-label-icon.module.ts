import {NgModule} from '@angular/core';
import {ObMockOptionLabelIconDirective} from '../_mocks/mock-option-label-icon.directive';
import {ObMockIconComponent} from '../../icon/_mocks/mock-icon.component';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockIconComponent, ObMockOptionLabelIconDirective],
	exports: [ObMockOptionLabelIconDirective],
})
export class ObMockOptionLabelIconModule {}
