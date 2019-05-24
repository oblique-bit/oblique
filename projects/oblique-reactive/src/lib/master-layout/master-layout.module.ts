import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {NotificationModule} from '../notification/notification.module';
import {SpinnerModule} from '../spinner/spinner.module';
import {ScrollingModule} from '../scrolling/scrolling.module';
import {OffCanvasModule} from '../off-canvas/off-canvas.module';

import {MasterLayoutComponent} from './master-layout.component';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutHeaderComponent} from './master-layout-header.component';
import {MasterLayoutHeaderToggleDirective} from './master-layout-header-toggle.directive';
import {MasterLayoutFooterComponent} from './master-layout-footer.component';
import {MasterLayoutNavigationService} from './master-layout-navigation.service';
import {MasterLayoutNavigationComponent} from './master-layout-navigation.component';
import {MasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';
import {MasterLayoutNavigationToggleDirective} from './master-layout-navigation-toggle.directive';
import {MasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';
import {MasterLayoutConfig} from './master-layout.config';

export {MasterLayoutComponent} from './master-layout.component';
export {MasterLayoutService} from './master-layout.service';
export {MasterLayoutHeaderToggleDirective} from './master-layout-header-toggle.directive';
export {MasterLayoutNavigationService} from './master-layout-navigation.service';
export {MasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';
export {MasterLayoutNavigationToggleDirective} from './master-layout-navigation-toggle.directive';
export {MasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';
export {ORNavigationLink} from './master-layout-navigation.component';
export {MasterLayoutConfig} from './master-layout.config';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		RouterModule,
		NotificationModule,
		SpinnerModule,
		ScrollingModule,
		OffCanvasModule
	],
	declarations: [
		MasterLayoutComponent,
		MasterLayoutHeaderComponent,
		MasterLayoutHeaderToggleDirective,
		MasterLayoutNavigationComponent,
		MasterLayoutFooterComponent,
		MasterLayoutNavigationItemDirective,
		MasterLayoutNavigationToggleDirective,
		MasterLayoutNavigationMenuDirective
	],
	exports: [
		MasterLayoutComponent,
		MasterLayoutHeaderToggleDirective,
		MasterLayoutNavigationItemDirective,
		MasterLayoutNavigationToggleDirective,
		MasterLayoutNavigationMenuDirective
	]
})
export class MasterLayoutModule {
}
