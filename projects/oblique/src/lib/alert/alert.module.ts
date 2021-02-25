import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {obliqueProviders} from '../utilities';
import {ObAlertComponent} from './alert.component';

export {ObAlertComponent} from './alert.component';
export {ObIAlertType} from './alert.model';

@NgModule({
	declarations: [ObAlertComponent],
	imports: [CommonModule, TranslateModule],
	providers: obliqueProviders(),
	exports: [ObAlertComponent]
})
export class ObAlertModule {}
