import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {NgbDatepickerConfig, NgbModule, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {
	OB_BANNER,
	OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION,
	ObAlertModule,
	ObDocumentMetaModule,
	ObDocumentMetaService,
	ObDropdownModule,
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
	ObSchemaValidationModule,
	ObScrollingModule,
	ObSearchBoxModule,
	ObSelectableModule,
	ObSpinnerModule,
	ObUnsavedChangesModule,
	ObUseObliqueIcons,
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
import {FONTS, THEMES, ThemeService} from './common/theme.service';

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
		MatCardModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		NgbModule,
		ObAlertModule,
		ObDocumentMetaModule,
		ObDropdownModule,
		ObErrorMessagesModule,
		ObExternalLinkModule,
		ObHttpApiInterceptorModule,
		ObInputClearModule,
		ObMasterLayoutModule,
		ObNotificationModule,
		ObOffCanvasModule,
		ObSchemaValidationModule,
		ObScrollingModule,
		ObSearchBoxModule,
		ObSelectableModule,
		ObSpinnerModule,
		ObUnsavedChangesModule,
		TranslateModule.forRoot(multiTranslateLoader())
	],
	providers: [
		{provide: OB_BANNER, useValue: environment.banner},
		{provide: HTTP_INTERCEPTORS, useClass: ObHttpApiInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: HttpMockErrorInterceptor, multi: true},
		{provide: OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION, useValue: false},
		{provide: ObUseObliqueIcons, useValue: true}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(
		private readonly tooltipConfig: NgbTooltipConfig,
		private readonly datepickerConfig: NgbDatepickerConfig,
		private readonly documentMetaService: ObDocumentMetaService,
		interceptorConfig: ObHttpApiInterceptorConfig,
		config: ObMasterLayoutConfig,
		theme: ThemeService
	) {
		// As the HEAD `title` element and the `description` meta element are outside any
		// Angular entry component, we use a service to update these element values:
		documentMetaService.titleSuffix = 'i18n.application.title';
		documentMetaService.description = 'i18n.application.description';

		// NgBootstrap configuration:
		tooltipConfig.container = 'body';
		datepickerConfig.navigation = 'arrows';

		interceptorConfig.api.url = HttpInterceptorSampleComponent.API_URL;
		config.locale.locales = ['en-us', 'fr-CH'];
		config.layout.hasOffCanvas = true;
		theme.setTheme(THEMES.MATERIAL);
		theme.setFont(FONTS.FRUTIGER);
	}
}
