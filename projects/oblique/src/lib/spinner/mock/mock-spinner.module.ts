import {NgModule} from '@angular/core';

import {SpinnerService} from '../spinner.module';
import {MockSpinnerComponent} from './mock-spinner.component';
import {MockSpinnerService} from './mock-spinner.service';

export {MockSpinnerComponent} from './mock-spinner.component';
export {MockSpinnerService} from './mock-spinner.service';

@NgModule({
	declarations: [MockSpinnerComponent],
	exports: [MockSpinnerComponent],
	providers: [
		{provide: SpinnerService, useClass: MockSpinnerService}
	]
})
export class MockSpinnerModule {
}
