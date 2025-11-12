import {NgModule, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {TranslateModule} from '@ngx-translate/core';

import {
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
	ObInputClearModule,
	ObMasterLayoutConfig,
	ObMasterLayoutModule,
	ObNotificationModule,
	ObOffCanvasModule,
	ObPopoverModule,
	ObSchemaValidationModule,
	ObScrollingModule,
	ObSelectableModule,
	ObSpinnerModule,
	ObUnsavedChangesModule,
	provideObliqueConfiguration,
} from '@oblique/oblique';
// App:
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomePageComponent} from './home/home.page';
import {HttpMockErrorInterceptor} from './samples/http-interceptor/http-mock-error.interceptor';
import {environment} from '../environments/environment';
import {registerLocaleData} from '@angular/common';

import localeFR from '@angular/common/locales/fr-CH';
import localeDE from '@angular/common/locales/de-CH';
import {HttpInterceptorSampleComponent} from './samples/http-interceptor/http-interceptor-sample.component';
import {infoContact, infoLinks, profileLinks} from './service-navigation.config';

registerLocaleData(localeFR);
registerLocaleData(localeDE);

@NgModule({
	declarations: [AppComponent, HomePageComponent],
	imports: [
		AppRoutingModule,
		BrowserModule,
		FormsModule,
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
		ObInputClearModule,
		ObMasterLayoutModule,
		ObNotificationModule,
		ObOffCanvasModule,
		ObPopoverModule,
		ObSchemaValidationModule,
		ObScrollingModule,
		ObSelectableModule,
		ObSpinnerModule,
		ObUnsavedChangesModule,
		ReactiveFormsModule,
		TranslateModule,
	],
	providers: [
		{provide: OB_BANNER, useValue: environment.banner},
		{provide: OB_PAMS_CONFIGURATION, useValue: environment.pams},
		{provide: HTTP_INTERCEPTORS, useClass: ObHttpApiInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: HttpMockErrorInterceptor, multi: true},
		{provide: OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION, useValue: false},
		provideMomentDateAdapter(),
		provideHttpClient(withInterceptorsFromDi()),
		provideObliqueConfiguration({
			accessibilityStatement: {
				applicationName: 'Sandbox',
				createdOn: new Date('2025-01-31'),
				reviewedOn: new Date('2025-01-31'),
				conformity: 'partial',
				exceptions: [
					'i18n.routes.accessibility.exception.first',
					'i18n.routes.accessibility.exception.second',
					'i18n.routes.accessibility.exception.third',
				],
				applicationOperator: 'i18n.routes.accessibility.operator',
				contact: [
					{email: 'oblique@bit.admin.ch', context: 'Oblique Team'},
					{phone: '123'},
					{
						url: 'http://example-contact-page.bit.admin.ch',
						context: 'Some random, inexistent, external link to demonstrate the feature',
					},
					{url: '/samples/button', context: 'Some random internal link to demonstrate the feature'},
				],
			},
			hasLanguageInUrl: true,
		}),
	],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor() {
		const documentMetaService = inject(ObDocumentMetaService);
		const interceptorConfig = inject(ObHttpApiInterceptorConfig);
		const config = inject(ObMasterLayoutConfig);

		// As the HEAD `title` element and the `description` meta element are outside any
		// Angular entry component, we use a service to update these element values:
		documentMetaService.titleSuffix = 'i18n.application.title';
		documentMetaService.description = 'i18n.application.description';

		interceptorConfig.api.url = HttpInterceptorSampleComponent.API_URL;
		config.locale.locales = ['en-us', 'fr-CH'];
		config.layout.hasOffCanvas = true;
		this.configureServiceSNavigation(config);
	}

	private configureServiceSNavigation(config: ObMasterLayoutConfig): void {
		config.header.serviceNavigation.displayInfo = true;
		config.header.serviceNavigation.infoContact = infoContact;
		config.header.serviceNavigation.infoHelpText = 'random help text';
		config.header.serviceNavigation.infoContactText = 'random contact text';
		config.header.serviceNavigation.infoDescription = 'random description text';
		if (environment.pams) {
			config.header.serviceNavigation.profileLinks = profileLinks;
			config.header.serviceNavigation.infoLinks = infoLinks;
			config.header.serviceNavigation.displayApplications = true;
			config.header.serviceNavigation.displayAuthentication = true;
			config.header.serviceNavigation.displayMessage = true;
			config.header.serviceNavigation.displayProfile = true;
			config.header.serviceNavigation.pamsAppId = '1';
		}
	}
}
