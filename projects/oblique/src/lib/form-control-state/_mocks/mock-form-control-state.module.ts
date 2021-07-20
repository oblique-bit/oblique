import {NgModule} from '@angular/core';

import {ObMockFormControlStateDirective} from './mock-form-control-state.directive';

export {ObMockFormControlStateDirective} from './mock-form-control-state.directive';

@NgModule({
	declarations: [ObMockFormControlStateDirective],
	exports: [ObMockFormControlStateDirective]
})
export class ObMockFormControlStateModule {}
