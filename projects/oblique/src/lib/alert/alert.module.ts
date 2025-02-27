import {NgModule} from '@angular/core';

import {ObAlertComponent} from './alert.component';

export {ObAlertComponent, OBLIQUE_HAS_ROLE_ALERT} from './alert.component';
export {ObIAlertType} from './alert.model';

@NgModule({
	imports: [ObAlertComponent],
	exports: [ObAlertComponent]
})
export class ObAlertModule {}
