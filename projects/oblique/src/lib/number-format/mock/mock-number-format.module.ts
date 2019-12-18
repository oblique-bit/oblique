import {NgModule} from '@angular/core';
import {MockNumberFormatDirective} from './mock-number-format.directive';

export {MockNumberFormatDirective} from './mock-number-format.directive';

@NgModule({
	declarations: [MockNumberFormatDirective],
	exports: [MockNumberFormatDirective]
})
export class MockNumberFormatModule {
}
