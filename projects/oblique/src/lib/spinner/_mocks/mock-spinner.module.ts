import {NgModule} from '@angular/core';

import {ObSpinnerService} from '../spinner.module';
import {ObMockSpinnerComponent} from './mock-spinner.component';
import {ObMockSpinnerService} from './mock-spinner.service';

export {ObMockSpinnerComponent} from './mock-spinner.component';
export {ObMockSpinnerService} from './mock-spinner.service';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockSpinnerComponent],
	exports: [ObMockSpinnerComponent],
	providers: [{provide: ObSpinnerService, useClass: ObMockSpinnerService}]
})
export class ObMockSpinnerModule {}
