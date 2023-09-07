import {NgModule} from '@angular/core';
import {ObMockOptionLabelIconDirective} from '../_mocks/mock-option-label-icon.directive';
import {ObMockIconModule} from '../../icon/_mocks/mock-icon.module';

@NgModule({
	imports: [ObMockIconModule, ObMockOptionLabelIconDirective],
	exports: [ObMockOptionLabelIconDirective]
})
export class ObMockOptionLabelIconModule {}
