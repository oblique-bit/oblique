import {NgModule} from '@angular/core';
import {ObMockOptionLabelIconDirective} from '../_mocks/mock-option-label-icon.directive';
import {ObMockIconModule} from '../../icon/_mocks/mock-icon.module';

@NgModule({
	declarations: [ObMockOptionLabelIconDirective],
	imports: [ObMockIconModule],
	exports: [ObMockOptionLabelIconDirective]
})
export class ObMockOptionLabelIconModule {}
