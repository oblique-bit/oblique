import {MatIconModule} from '@angular/material/icon';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {TranslateModule} from '@ngx-translate/core';
import {ObExternalLinkModule} from '../external-link/external-link.module';
import {ObNotificationModule} from '../notification/notification.module';
import {ObSpinnerModule} from '../spinner/spinner.module';
import {ObScrollingModule} from '../scrolling/scrolling.module';
import {ObOffCanvasModule} from '../off-canvas/off-canvas.module';
import {ObMasterLayoutComponent} from './master-layout/master-layout.component';
import {ObMasterLayoutHeaderComponent} from './master-layout-header/master-layout-header.component';
import {ObMasterLayoutHeaderToggleDirective} from './master-layout-header/master-layout-header-toggle.directive';
import {ObMasterLayoutFooterComponent} from './master-layout-footer/master-layout-footer.component';
import {ObMasterLayoutNavigationComponent} from './master-layout-navigation/master-layout-navigation.component';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation/master-layout-navigation-item.directive';
import {ObMasterLayoutNavigationToggleDirective} from './master-layout-navigation/master-layout-navigation-toggle.directive';
import {ObOutlineDirective} from './outline.directive';
import {obliqueProviders} from '../utilities';
import {ObAriaMenuButtonDirective} from './aria-menu-button.directive';
import {ObIconModule} from '../icon/icon.module';
import {ObButtonModule} from '../button/button.module';
import {ObServiceNavigationModule} from '../service-navigation/service-navigation.module';
import {ObMasterLayoutNavigationMenuDirective} from './master-layout-navigation/master-layout-navigation-menu.directive';

export {ObMasterLayoutComponent} from './master-layout/master-layout.component';
export {ObMasterLayoutComponentService} from './master-layout/master-layout.component.service';
export {ObMasterLayoutService} from './master-layout.service';
export {ObMasterLayoutFooterComponent} from './master-layout-footer/master-layout-footer.component';
export {ObMasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
export {ObMasterLayoutHeaderComponent} from './master-layout-header/master-layout-header.component';
export {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
export {ObMasterLayoutNavigationComponent} from './master-layout-navigation/master-layout-navigation.component';
export {ObMasterLayoutNavigationService} from './master-layout-navigation/master-layout-navigation.service';
export {ObMasterLayoutConfig} from './master-layout.config';
export {
	ObINavigationLink,
	ObEScrollMode,
	ObIMasterLayoutEvent,
	ObEMasterLayoutEventValues,
	ObISkipLink,
	OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION
} from './master-layout.model';
export {ObOutlineDirective} from './outline.directive';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		ObButtonModule,
		ObExternalLinkModule,
		ObIconModule,
		ObNotificationModule,
		ObOffCanvasModule,
		ObScrollingModule,
		ObServiceNavigationModule,
		ObSpinnerModule,
		RouterModule,
		ScrollingModule,
		TranslateModule
	],
	declarations: [
		ObAriaMenuButtonDirective,
		ObMasterLayoutComponent,
		ObMasterLayoutFooterComponent,
		ObMasterLayoutHeaderComponent,
		ObMasterLayoutHeaderToggleDirective,
		ObMasterLayoutNavigationComponent,
		ObMasterLayoutNavigationItemDirective,
		ObMasterLayoutNavigationMenuDirective,
		ObMasterLayoutNavigationToggleDirective,
		ObOutlineDirective
	],
	providers: obliqueProviders(),
	exports: [
		ObMasterLayoutComponent,
		ObMasterLayoutFooterComponent,
		ObMasterLayoutHeaderComponent,
		ObMasterLayoutNavigationComponent,
		ObOutlineDirective
	]
})
export class ObMasterLayoutModule {}
