import {NgModule} from '@angular/core';
import {ObMockAlertComponent} from './mock-alert.component';

export {ObMockAlertComponent} from './mock-alert.component';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockAlertComponent],
	exports: [ObMockAlertComponent]
})
export class ObMockAlertModule {}
