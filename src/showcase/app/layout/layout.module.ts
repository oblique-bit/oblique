import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MasterLayoutModule} from '../../../lib/ng';
import {LayoutControlsComponent} from './controls/controls.component';
import {LayoutNavigationComponent} from './navigation/navigation.component';
import {LayoutFooterComponent} from './footer/footer.component';


@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		TranslateModule,
		MasterLayoutModule
	],
	declarations: [
		LayoutControlsComponent,
		LayoutFooterComponent,
		LayoutNavigationComponent
	],
	exports: [
		LayoutControlsComponent,
		LayoutFooterComponent,
		LayoutNavigationComponent
	]
})
export class LayoutModule {
}
