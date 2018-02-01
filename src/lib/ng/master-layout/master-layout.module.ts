import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
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

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
	],
	declarations: [
		MasterLayoutApplicationDirective,
		MasterLayoutHeaderDirective,
		MasterLayoutFooterDirective,
		MasterLayoutNavigationDirective,
		MasterLayoutNavigationItemDirective,
		MasterLayoutNavigationToggleDirective,
		MasterLayoutNavigationMenuDirective
	],
	exports: [
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
				MasterLayoutApplicationService,
				MasterLayoutHeaderService,
				MasterLayoutFooterService
			]
		};
	}
}
