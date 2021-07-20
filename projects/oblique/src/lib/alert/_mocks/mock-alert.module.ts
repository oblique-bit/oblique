import {NgModule} from '@angular/core';
import {ObMockAlertComponent} from './mock-alert.component';

export {ObMockAlertComponent} from './mock-alert.component';

@NgModule({
	declarations: [ObMockAlertComponent],
	exports: [ObMockAlertComponent]
})
export class ObMockAlertModule {}
