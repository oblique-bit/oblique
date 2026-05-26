import {NgModule} from '@angular/core';
import {ObMockAlertComponent} from './mock-alert.component';

export {ObMockAlertComponent} from './mock-alert.component';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockAlertComponent],
	exports: [ObMockAlertComponent],
})
export class ObMockAlertModule {}
