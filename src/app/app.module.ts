import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {GestureConfig} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {NgbDatepickerConfig, NgbModule, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {
	ObDocumentMetaModule,
	ObDocumentMetaService,
	ObDropdownModule,
	ObErrorMessagesModule,
	FONTS,
	ObMasterLayoutConfig,
	ObMasterLayoutModule,
	ObMultiselectModule,
	multiTranslateLoader,
	ObNotificationModule,
	OBLIQUE_FONT,
	ObHttpApiInterceptor,
	ObHttpApiInterceptorConfig,
	ObHttpApiInterceptorModule,
	ObSelectableModule,
	ObOffCanvasModule,
	ObSchemaValidationModule,
	ObScrollingModule,
	ObSearchBoxModule,
	ObSpinnerModule,
	ObInputClearModule,
	THEMES,
	ObThemeService,
	ObUnsavedChangesModule
} from 'oblique';
// App:
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomePageComponent} from './home/home.page';
import {HttpMockErrorInterceptor} from './samples/http-interceptor/http-mock-error.interceptor';
import {HttpInterceptorSampleComponent} from './samples/http-interceptor/http-interceptor-sample.component';

@NgModule({
	declarations: [
		AppComponent,
		HomePageComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		NgbModule,
		ObDocumentMetaModule,
		ObErrorMessagesModule,
		ObDropdownModule,
		ObHttpApiInterceptorModule,
		ObMasterLayoutModule,
		ObMultiselectModule,
		ObNotificationModule,
		ObOffCanvasModule,
		ObSchemaValidationModule,
		ObScrollingModule,
		ObSearchBoxModule,
		ObSelectableModule,
		ObSpinnerModule,
		ObUnsavedChangesModule,
		TranslateModule.forRoot(multiTranslateLoader()),
		AppRoutingModule,
		ObMasterLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		ObInputClearModule
	],
	providers: [
		{provide: OBLIQUE_FONT, useValue: FONTS.ROBOTO},
		{provide: HTTP_INTERCEPTORS, useClass: ObHttpApiInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: HttpMockErrorInterceptor, multi: true},
		{provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig}
	],
	entryComponents: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(private readonly tooltipConfig: NgbTooltipConfig,
				private readonly datepickerConfig: NgbDatepickerConfig,
				private readonly documentMetaService: ObDocumentMetaService,
				interceptorConfig: ObHttpApiInterceptorConfig,
				config: ObMasterLayoutConfig,
				theme: ObThemeService) {
		// As the HEAD `title` element and the `description` meta element are outside any
		// Angular entry component, we use a service to update these element values:
		documentMetaService.titleSuffix = 'i18n.application.title';
		documentMetaService.description = 'i18n.application.description';

		// NgBootstrap configuration:
		tooltipConfig.container = 'body';
		datepickerConfig.navigation = 'arrows';

		interceptorConfig.api.url = HttpInterceptorSampleComponent.API_URL;
		config.locale.locales = ['en', 'fr'];
		theme.setTheme(THEMES.BOOTSTRAP);
	}
}
