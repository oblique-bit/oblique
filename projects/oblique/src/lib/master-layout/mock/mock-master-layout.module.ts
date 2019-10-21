import {NgModule} from '@angular/core';
import {MasterLayoutConfig, MasterLayoutNavigationService, MasterLayoutService} from '../master-layout.module';
import {MasterLayoutHeaderService} from '../master-layout-header/master-layout-header.service';
import {MasterLayoutFooterService} from '../master-layout-footer/master-layout-footer.service';

import {MockMasterLayoutComponent} from './mock-master-layout.component';
import {MockMasterLayoutHeaderComponent} from './mock-master-layout-header.component';
import {MockMasterLayoutHeaderToggleDirective} from './mock-master-layout-header-toggle.directive';
import {MockMasterLayoutFooterComponent} from './mock-master-layout-footer.component';
import {MockMasterLayoutNavigationComponent} from './mock-master-layout-navigation.component';
import {MockMasterLayoutNavigationItemDirective} from './mock-master-layout-navigation-item.directive';
import {MockMasterLayoutNavigationToggleDirective} from './mock-master-layout-navigation-toggle.directive';
import {MockMasterLayoutNavigationMenuDirective} from './mock-master-layout-navigation-menu.directive';
import {MockMasterLayoutFooterService} from './mock-master-layout-footer.service';
import {MockMasterLayoutHeaderService} from './mock-master-layout-header.service';
import {MockMasterLayoutNavigationService} from './mock-master-layout-navigation.service';
import {MockMasterLayoutConfig} from './mock-master-layout.config';
import {MockMasterLayoutService} from './mock-master-layout.service';
import {MockMasterLayoutComponentService} from './mock-master-layout.component.service';
import {MasterLayoutComponentService} from '../master-layout/master-layout.component.service';

export {MockMasterLayoutComponent} from './mock-master-layout.component';
export {MockMasterLayoutHeaderComponent} from './mock-master-layout-header.component';
export {MockMasterLayoutHeaderToggleDirective} from './mock-master-layout-header-toggle.directive';
export {MockMasterLayoutFooterComponent} from './mock-master-layout-footer.component';
export {MockMasterLayoutNavigationComponent} from './mock-master-layout-navigation.component';
export {MockMasterLayoutNavigationItemDirective} from './mock-master-layout-navigation-item.directive';
export {MockMasterLayoutNavigationToggleDirective} from './mock-master-layout-navigation-toggle.directive';
export {MockMasterLayoutNavigationMenuDirective} from './mock-master-layout-navigation-menu.directive';
export {MockMasterLayoutFooterService} from './mock-master-layout-footer.service';
export {MockMasterLayoutHeaderService} from './mock-master-layout-header.service';
export {MockMasterLayoutNavigationService} from './mock-master-layout-navigation.service';
export {MockMasterLayoutComponentService} from './mock-master-layout.component.service';
export {MockMasterLayoutConfig} from './mock-master-layout.config';
export {MockMasterLayoutService} from './mock-master-layout.service';

@NgModule({
	declarations: [
		MockMasterLayoutComponent,
		MockMasterLayoutHeaderComponent,
		MockMasterLayoutHeaderToggleDirective,
		MockMasterLayoutNavigationComponent,
		MockMasterLayoutFooterComponent,
		MockMasterLayoutNavigationItemDirective,
		MockMasterLayoutNavigationToggleDirective,
		MockMasterLayoutNavigationMenuDirective
	],
	exports: [
		MockMasterLayoutComponent,
		MockMasterLayoutHeaderComponent,
		MockMasterLayoutHeaderToggleDirective,
		MockMasterLayoutNavigationComponent,
		MockMasterLayoutFooterComponent,
		MockMasterLayoutNavigationItemDirective,
		MockMasterLayoutNavigationToggleDirective,
		MockMasterLayoutNavigationMenuDirective
	],
	providers: [
		{provide: MasterLayoutFooterService, useClass: MockMasterLayoutFooterService},
		{provide: MasterLayoutHeaderService, useClass: MockMasterLayoutHeaderService},
		{provide: MasterLayoutNavigationService, useClass: MockMasterLayoutNavigationService},
		{provide: MasterLayoutComponentService, useClass: MockMasterLayoutComponentService},
		{provide: MasterLayoutConfig, useClass: MockMasterLayoutConfig},
		{provide: MasterLayoutService, useClass: MockMasterLayoutService}
	]
})
export class MockMasterLayoutModule {

}
