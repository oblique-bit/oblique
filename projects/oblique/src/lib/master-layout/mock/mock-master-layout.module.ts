import {NgModule} from '@angular/core';
import {ObMasterLayoutConfig, ObMasterLayoutNavigationService, ObMasterLayoutService} from '../master-layout.module';
import {ObMasterLayoutHeaderService} from '../master-layout-header/master-layout-header.service';
import {ObMasterLayoutFooterService} from '../master-layout-footer/master-layout-footer.service';

import {ObMockMasterLayoutComponent} from './mock-master-layout.component';
import {ObMockMasterLayoutHeaderComponent} from './mock-master-layout-header.component';
import {ObMockMasterLayoutHeaderToggleDirective} from './mock-master-layout-header-toggle.directive';
import {ObMockMasterLayoutFooterComponent} from './mock-master-layout-footer.component';
import {ObMockMasterLayoutNavigationComponent} from './mock-master-layout-navigation.component';
import {ObMockMasterLayoutNavigationItemDirective} from './mock-master-layout-navigation-item.directive';
import {ObMockMasterLayoutNavigationToggleDirective} from './mock-master-layout-navigation-toggle.directive';
import {ObMockMasterLayoutNavigationMenuDirective} from './mock-master-layout-navigation-menu.directive';
import {ObMockMasterLayoutFooterService} from './mock-master-layout-footer.service';
import {ObMockMasterLayoutHeaderService} from './mock-master-layout-header.service';
import {ObMockMasterLayoutNavigationService} from './mock-master-layout-navigation.service';
import {ObMockMasterLayoutConfig} from './mock-master-layout.config';
import {ObMockMasterLayoutService} from './mock-master-layout.service';
import {ObMockMasterLayoutComponentService} from './mock-master-layout.component.service';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';

export {ObMockMasterLayoutComponent} from './mock-master-layout.component';
export {ObMockMasterLayoutHeaderComponent} from './mock-master-layout-header.component';
export {ObMockMasterLayoutHeaderToggleDirective} from './mock-master-layout-header-toggle.directive';
export {ObMockMasterLayoutFooterComponent} from './mock-master-layout-footer.component';
export {ObMockMasterLayoutNavigationComponent} from './mock-master-layout-navigation.component';
export {ObMockMasterLayoutNavigationItemDirective} from './mock-master-layout-navigation-item.directive';
export {ObMockMasterLayoutNavigationToggleDirective} from './mock-master-layout-navigation-toggle.directive';
export {ObMockMasterLayoutNavigationMenuDirective} from './mock-master-layout-navigation-menu.directive';
export {ObMockMasterLayoutFooterService} from './mock-master-layout-footer.service';
export {ObMockMasterLayoutHeaderService} from './mock-master-layout-header.service';
export {ObMockMasterLayoutNavigationService} from './mock-master-layout-navigation.service';
export {ObMockMasterLayoutComponentService} from './mock-master-layout.component.service';
export {ObMockMasterLayoutConfig} from './mock-master-layout.config';
export {ObMockMasterLayoutService} from './mock-master-layout.service';

@NgModule({
	declarations: [
		ObMockMasterLayoutComponent,
		ObMockMasterLayoutHeaderComponent,
		ObMockMasterLayoutHeaderToggleDirective,
		ObMockMasterLayoutNavigationComponent,
		ObMockMasterLayoutFooterComponent,
		ObMockMasterLayoutNavigationItemDirective,
		ObMockMasterLayoutNavigationToggleDirective,
		ObMockMasterLayoutNavigationMenuDirective
	],
	exports: [
		ObMockMasterLayoutComponent,
		ObMockMasterLayoutHeaderComponent,
		ObMockMasterLayoutHeaderToggleDirective,
		ObMockMasterLayoutNavigationComponent,
		ObMockMasterLayoutFooterComponent,
		ObMockMasterLayoutNavigationItemDirective,
		ObMockMasterLayoutNavigationToggleDirective,
		ObMockMasterLayoutNavigationMenuDirective
	],
	providers: [
		{provide: ObMasterLayoutFooterService, useClass: ObMockMasterLayoutFooterService},
		{provide: ObMasterLayoutHeaderService, useClass: ObMockMasterLayoutHeaderService},
		{provide: ObMasterLayoutNavigationService, useClass: ObMockMasterLayoutNavigationService},
		{provide: ObMasterLayoutComponentService, useClass: ObMockMasterLayoutComponentService},
		{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig},
		{provide: ObMasterLayoutService, useClass: ObMockMasterLayoutService}
	]
})
export class ObMockMasterLayoutModule {

}
