import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';

import {
	OB_ACTIVATE_SERVICE_NAVIGATION,
	OB_BANNER,
	OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION,
	OB_PAMS_CONFIGURATION,
	ObAlertModule,
	ObAutocompleteModule,
	ObButtonModule,
	ObDocumentMetaModule,
	ObDocumentMetaService,
	ObErrorMessagesModule,
	ObExternalLinkModule,
	ObHttpApiInterceptor,
	ObHttpApiInterceptorConfig,
	ObHttpApiInterceptorModule,
	ObIconModule,
	ObInputClearModule,
	ObMasterLayoutConfig,
	ObMasterLayoutModule,
	ObNotificationModule,
	ObOffCanvasModule,
	ObPopoverModule,
	ObSchemaValidationModule,
	ObScrollingModule,
	ObSearchBoxModule,
	ObSelectableModule,
	ObSpinnerModule,
	ObUnsavedChangesModule,
	multiTranslateLoader
} from '@oblique/oblique';
// App:
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomePageComponent} from './home/home.page';
import {HttpMockErrorInterceptor} from './samples/http-interceptor/http-mock-error.interceptor';
import {environment} from '../environments/environment';
import {registerLocaleData} from '@angular/common';

import localeFR from '@angular/common/locales/fr-CH';
import {HttpInterceptorSampleComponent} from './samples/http-interceptor/http-interceptor-sample.component';
import {FONTS, FontService} from './common/font.service';
import {infoContact, infoLinks, profileLinks} from './service-navigation.config';

registerLocaleData(localeFR);

@NgModule({
	declarations: [AppComponent, HomePageComponent],
	imports: [
		AppRoutingModule,
		ObIconModule.forRoot(),
		BrowserAnimationsModule,
		BrowserModule,
		FormsModule,
		HttpClientModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatTooltipModule,
		ObAlertModule,
		ObAutocompleteModule,
		ObButtonModule,
		ObDocumentMetaModule,
		ObErrorMessagesModule,
		ObExternalLinkModule,
		ObHttpApiInterceptorModule,
		ObInputClearModule,
		ObMasterLayoutModule,
		ObNotificationModule,
		ObOffCanvasModule,
		ObPopoverModule,
		ObSchemaValidationModule,
		ObScrollingModule,
		ObSearchBoxModule,
		ObSelectableModule,
		ObSpinnerModule,
		ObUnsavedChangesModule,
		ReactiveFormsModule,
		TranslateModule.forRoot(multiTranslateLoader())
	],
	providers: [
		{provide: OB_BANNER, useValue: environment.banner},
		{provide: OB_ACTIVATE_SERVICE_NAVIGATION, useValue: true},
		{provide: OB_PAMS_CONFIGURATION, useValue: environment.pams},
		{provide: HTTP_INTERCEPTORS, useClass: ObHttpApiInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: HttpMockErrorInterceptor, multi: true},
		{provide: OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION, useValue: false}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(
		private readonly documentMetaService: ObDocumentMetaService,
		interceptorConfig: ObHttpApiInterceptorConfig,
		config: ObMasterLayoutConfig,
		font: FontService
	) {
		// As the HEAD `title` element and the `description` meta element are outside any
		// Angular entry component, we use a service to update these element values:
		documentMetaService.titleSuffix = 'i18n.application.title';
		documentMetaService.description = 'i18n.application.description';

		interceptorConfig.api.url = HttpInterceptorSampleComponent.API_URL;
		config.locale.locales = ['en-us', 'fr-CH'];
		config.layout.hasOffCanvas = true;
		font.setFont(FONTS.FRUTIGER);
		this.configureServiceSNavigation(config);
	}

	private configureServiceSNavigation(config: ObMasterLayoutConfig): void {
		config.header.serviceNavigation.profileLinks = profileLinks;
		config.header.serviceNavigation.infoLinks = infoLinks;
		config.header.serviceNavigation.infoContact = infoContact;
		config.header.serviceNavigation.displayApplications = true;
		config.header.serviceNavigation.displayAuthentication = true;
		config.header.serviceNavigation.displayInfo = true;
		config.header.serviceNavigation.displayMessage = true;
		config.header.serviceNavigation.displayProfile = true;
	}
}
