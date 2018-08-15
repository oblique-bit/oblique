import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MasterLayoutComponent} from './master-layout.component';
import {MasterLayoutService} from './master-layout.service';
import {MasterLayoutHeaderComponent} from './master-layout-header.component';
import {MasterLayoutHeaderToggleDirective} from './master-layout-header-toggle.directive';
import {MasterLayoutFooterComponent} from './master-layout-footer.component';

import {MasterLayoutApplicationService} from './master-layout-application.service';
import {MasterLayoutApplicationDirective} from './master-layout-application.directive';
import {MasterLayoutHeaderDirective} from './master-layout-header.directive';
import {MasterLayoutHeaderService} from './master-layout-header.service';
import {MasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';
import {MasterLayoutNavigationToggleDirective} from './master-layout-navigation-toggle.directive';
import {MasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';
import {MasterLayoutNavigationDirective} from './master-layout-navigation.directive';
import {MasterLayoutFooterDirective} from './master-layout-footer.directive';
import {MasterLayoutFooterService} from './master-layout-footer.service';
import {NotificationModule} from '../notification';
import {SpinnerModule} from '../spinner';
import {ScrollingModule} from '../scrolling';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		RouterModule,
		NotificationModule,
		SpinnerModule,
		ScrollingModule
	],
	declarations: [
		MasterLayoutComponent,
		MasterLayoutHeaderComponent,
		MasterLayoutHeaderToggleDirective,
		MasterLayoutFooterComponent,

		MasterLayoutApplicationDirective,
		MasterLayoutHeaderDirective,
		MasterLayoutFooterDirective,
		MasterLayoutNavigationDirective,
		MasterLayoutNavigationItemDirective,
		MasterLayoutNavigationToggleDirective,
		MasterLayoutNavigationMenuDirective
	],
	exports: [
		MasterLayoutComponent,
		MasterLayoutHeaderToggleDirective,

		MasterLayoutApplicationDirective,
		MasterLayoutHeaderDirective,
		MasterLayoutFooterDirective,
		MasterLayoutNavigationDirective,
		MasterLayoutNavigationItemDirective,
		MasterLayoutNavigationToggleDirective,
		MasterLayoutNavigationMenuDirective
	]
})
export class MasterLayoutModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: MasterLayoutModule,
			providers: [
				MasterLayoutService,
				MasterLayoutApplicationService,
				MasterLayoutHeaderService,
				MasterLayoutFooterService
			]
		};
	}
}
