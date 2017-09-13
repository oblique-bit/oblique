import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {LayoutControlsComponent} from './controls/controls.component';
import {LayoutNavigationComponent} from './navigation/navigation.component';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		TranslateModule,
		NgbModule
	],
	declarations: [LayoutControlsComponent, LayoutNavigationComponent],
	exports: [LayoutControlsComponent, LayoutNavigationComponent]
})
export class LayoutModule {
}
