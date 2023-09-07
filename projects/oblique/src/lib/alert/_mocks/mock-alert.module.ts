import {NgModule} from '@angular/core';
import {ObMockAlertComponent} from './mock-alert.component';

export {ObMockAlertComponent} from './mock-alert.component';

@NgModule({
	imports: [ObMockAlertComponent],
	exports: [ObMockAlertComponent]
})
export class ObMockAlertModule {}
