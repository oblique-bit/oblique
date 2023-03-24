import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {TranslateModule} from '@ngx-translate/core';
import {obliqueProviders} from '../utilities';
import {ObButtonModule} from '../button/button.module';
import {ObExternalLinkModule} from '../external-link/external-link.module';
import {ObPopoverModule} from '../popover/popover.module';
import {ObTranslateParamsModule} from '../translate-params/translate-params.module';
import {ObIsUserLoggedInPipe} from './shared/is-user-logged-in.pipe';
import {ObServiceNavigationPopoverSectionComponent} from './shared/popover-section/service-navigation-popover-section.component';
import {ObServiceNavigationAuthenticationComponent} from './authentication/service-navigation-authentication.component';
import {ObServiceNavigationProfileComponent} from './profile/service-navigation-profile.component';
import {ObServiceNavigationMessageComponent} from './message/service-navigation-message.component';
import {ObServiceNavigationComponent} from './service-navigation.component';

@NgModule({
	providers: [...obliqueProviders()],
	imports: [
		CommonModule,
		MatBadgeModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		ObButtonModule,
		ObExternalLinkModule,
		ObPopoverModule,
		ObTranslateParamsModule,
		TranslateModule
	],
	declarations: [
		ObIsUserLoggedInPipe,
		ObServiceNavigationAuthenticationComponent,
		ObServiceNavigationComponent,
		ObServiceNavigationMessageComponent,
		ObServiceNavigationPopoverSectionComponent,
		ObServiceNavigationProfileComponent
	],
	exports: [ObServiceNavigationComponent]
})
export class ObServiceNavigationModule {}
