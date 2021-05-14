import {NgModule} from '@angular/core';
import {ObMockMandatoryDirective} from './mock-mandatory.directive';
export {ObMockMandatoryDirective} from './mock-mandatory.directive';

@NgModule({
	declarations: [ObMockMandatoryDirective],
	exports: [ObMockMandatoryDirective]
})
export class ObMockMandatoryModule {}
