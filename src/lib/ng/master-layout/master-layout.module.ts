import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
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
import {MasterLayoutHeaderToggleDirective} from './master-layout-header-toggle.directive';
import {MasterLayoutComponent} from './master-layout.component';
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
		MasterLayoutApplicationDirective,
		MasterLayoutHeaderDirective,
		MasterLayoutHeaderToggleDirective,
		MasterLayoutFooterDirective,
		MasterLayoutNavigationDirective,
		MasterLayoutNavigationItemDirective,
		MasterLayoutNavigationToggleDirective,
		MasterLayoutNavigationMenuDirective,
		MasterLayoutComponent
	],
	exports: [
		MasterLayoutApplicationDirective,
		MasterLayoutHeaderDirective,
		MasterLayoutHeaderToggleDirective,
		MasterLayoutFooterDirective,
		MasterLayoutNavigationDirective,
		MasterLayoutNavigationItemDirective,
		MasterLayoutNavigationToggleDirective,
		MasterLayoutNavigationMenuDirective,
		MasterLayoutComponent
	]
})
export class MasterLayoutModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: MasterLayoutModule,
			providers: [
				MasterLayoutApplicationService,
				MasterLayoutHeaderService,
				MasterLayoutFooterService
			]
		};
	}
}
