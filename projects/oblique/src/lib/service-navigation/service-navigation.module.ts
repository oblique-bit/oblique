import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSelectModule} from '@angular/material/select';
import {TranslateModule} from '@ngx-translate/core';
import {obliqueProviders} from '../utilities';
import {ObButtonModule} from '../button/button.module';
import {ObExternalLinkModule} from '../external-link/external-link.module';
import {ObPopoverModule} from '../popover/popover.module';
import {ObTranslateParamsModule} from '../translate-params/translate-params.module';
import {ObIsUserLoggedInPipe} from './shared/is-user-logged-in.pipe';
import {ObServiceNavigationPopoverSectionComponent} from './shared/popover-section/service-navigation-popover-section.component';
import {ObLimitArraySizePipe} from './shared/limit-array-size.pipe';
import {ObServiceNavigationAuthenticationComponent} from './authentication/service-navigation-authentication.component';
import {ObServiceNavigationProfileComponent} from './profile/service-navigation-profile.component';
import {ObServiceNavigationMessageComponent} from './message/service-navigation-message.component';
import {ObServiceNavigationInfoComponent} from './info/service-navigation-info.component';
import {ObServiceNavigationApplicationsComponent} from './applications/service-navigation-applications.component';
import {ObServiceNavigationApplicationAltPipe} from './applications/service-navigation-application-image-alt.pipe';
import {ObServiceNavigationLanguagesComponent} from './languages/service-navigation-languages.component';
import {ObContactToLinksPipe} from './info/contact-to-links.pipe';
import {ObServiceNavigationComponent} from './service-navigation.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ObEportalCsrfInterceptor} from './eportal-csrf-interceptor/eportal-csrf-interceptor';
import {ObDisableLinkDirective} from './shared/disable-link/disable-link.directive';

@NgModule({
	providers: [
		...obliqueProviders(),
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ObEportalCsrfInterceptor,
			multi: true
		}
	],
	imports: [
		CommonModule,
		MatBadgeModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatTooltipModule,
		NgOptimizedImage,
		ObButtonModule,
		ObDisableLinkDirective,
		ObExternalLinkModule,
		ObPopoverModule,
		ObTranslateParamsModule,
		TranslateModule
	],
	declarations: [
		ObContactToLinksPipe,
		ObIsUserLoggedInPipe,
		ObLimitArraySizePipe,
		ObServiceNavigationApplicationAltPipe,
		ObServiceNavigationApplicationsComponent,
		ObServiceNavigationAuthenticationComponent,
		ObServiceNavigationComponent,
		ObServiceNavigationInfoComponent,
		ObServiceNavigationLanguagesComponent,
		ObServiceNavigationMessageComponent,
		ObServiceNavigationPopoverSectionComponent,
		ObServiceNavigationProfileComponent
	],
	exports: [ObServiceNavigationComponent]
})
export class ObServiceNavigationModule {}
