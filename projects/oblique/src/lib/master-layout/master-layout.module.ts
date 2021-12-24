import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

import {TranslateModule} from '@ngx-translate/core';
import {ObNotificationModule} from '../notification/notification.module';
import {ObSpinnerModule} from '../spinner/spinner.module';
import {ObScrollingModule} from '../scrolling/scrolling.module';
import {ObOffCanvasModule} from '../off-canvas/off-canvas.module';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObMasterLayoutComponent} from './master-layout/master-layout.component';
import {ObMasterLayoutHeaderComponent} from './master-layout-header/master-layout-header.component';
import {ObMasterLayoutHeaderToggleDirective} from './master-layout-header/master-layout-header-toggle.directive';
import {ObMasterLayoutFooterComponent} from './master-layout-footer/master-layout-footer.component';
import {ObMasterLayoutNavigationComponent} from './master-layout-navigation/master-layout-navigation.component';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation/master-layout-navigation-item.directive';
import {ObMasterLayoutNavigationToggleDirective} from './master-layout-navigation/master-layout-navigation-toggle.directive';
import {ObMasterLayoutNavigationMenuDirective} from './master-layout-navigation/master-layout-navigation-menu.directive';
import {obliqueProviders} from '../utilities';
import {ObAriaMenuButtonDirective} from './aria-menu-button.directive';
import {ObIconModule} from '../icon/icon.module';
import {ObButtonModule} from '../button/button.module';

export {ObMasterLayoutComponent} from './master-layout/master-layout.component';
export {ObMasterLayoutComponentService} from './master-layout/master-layout.component.service';
export {ObMasterLayoutService} from './master-layout.service';
export {ObMasterLayoutFooterComponent} from './master-layout-footer/master-layout-footer.component';
export {ObMasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
export {ObMasterLayoutHeaderComponent} from './master-layout-header/master-layout-header.component';
export {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
export {ObMasterLayoutHeaderToggleDirective} from './master-layout-header/master-layout-header-toggle.directive';
export {ObMasterLayoutNavigationComponent} from './master-layout-navigation/master-layout-navigation.component';
export {ObMasterLayoutNavigationService} from './master-layout-navigation/master-layout-navigation.service';
export {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation/master-layout-navigation-item.directive';
export {ObMasterLayoutNavigationToggleDirective} from './master-layout-navigation/master-layout-navigation-toggle.directive';
export {ObMasterLayoutNavigationMenuDirective} from './master-layout-navigation/master-layout-navigation-menu.directive';
export {ObMasterLayoutConfig} from './master-layout.config';
export {ObINavigationLink, ObEScrollMode, ObIMasterLayoutEvent, ObEMasterLayoutEventValues} from './master-layout.model';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		RouterModule,
		ObNotificationModule,
		ObSpinnerModule,
		ObScrollingModule,
		ObOffCanvasModule,
		ObIconModule,
		ObButtonModule,
		MatButtonModule
	],
	declarations: [
		ObMasterLayoutComponent,
		ObMasterLayoutHeaderComponent,
		ObMasterLayoutHeaderToggleDirective,
		ObMasterLayoutNavigationComponent,
		ObMasterLayoutFooterComponent,
		ObMasterLayoutNavigationItemDirective,
		ObMasterLayoutNavigationToggleDirective,
		ObMasterLayoutNavigationMenuDirective,
		ObAriaMenuButtonDirective
	],
	providers: obliqueProviders(),
	exports: [
		ObMasterLayoutComponent,
		ObMasterLayoutHeaderComponent,
		ObMasterLayoutHeaderToggleDirective,
		ObMasterLayoutNavigationComponent,
		ObMasterLayoutFooterComponent,
		ObMasterLayoutNavigationItemDirective,
		ObMasterLayoutNavigationToggleDirective,
		ObMasterLayoutNavigationMenuDirective
	]
})
export class ObMasterLayoutModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObMasterLayoutModule);
	}
}
