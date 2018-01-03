import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MasterLayoutModule} from '../../../lib/ng';
import {LayoutControlsComponent} from './controls/controls.component';
import {LayoutNavigationComponent} from './navigation/navigation.component';


@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		TranslateModule,
		NgbModule,
		MasterLayoutModule
	],
	declarations: [
		LayoutControlsComponent,
		LayoutNavigationComponent
	],
	exports: [
		LayoutControlsComponent,
		LayoutNavigationComponent
	]
})
export class LayoutModule {
}
