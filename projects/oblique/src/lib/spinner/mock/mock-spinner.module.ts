import {NgModule} from '@angular/core';

import {ObSpinnerService} from '../spinner.module';
import {ObMockSpinnerComponent} from './mock-spinner.component';
import {ObMockSpinnerService} from './mock-spinner.service';

export {ObMockSpinnerComponent} from './mock-spinner.component';
export {ObMockSpinnerService} from './mock-spinner.service';

@NgModule({
	declarations: [ObMockSpinnerComponent],
	exports: [ObMockSpinnerComponent],
	providers: [
		{provide: ObSpinnerService, useClass: ObMockSpinnerService}
	]
})
export class ObMockSpinnerModule {
}
