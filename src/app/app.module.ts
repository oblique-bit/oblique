import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgbDatepickerConfig, NgbModule, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {
	DocumentMetaModule,
	DocumentMetaService,
	DropdownModule,
	ErrorMessagesModule,
	FONTS,
	MasterLayoutConfig,
	MasterLayoutModule,
	MultiselectModule,
	multiTranslateLoader,
	NotificationModule,
	OBLIQUE_FONT,
	OBLIQUE_THEME,
	ObliqueHttpInterceptor,
	ObliqueHttpInterceptorConfig,
	ObliqueHttpModule,
	OffCanvasModule,
	SchemaValidationModule,
	ScrollingModule,
	SearchBoxModule,
	SpinnerModule,
	TextControlClearModule,
	THEMES,
	UnsavedChangesModule
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
		DocumentMetaModule,
		ErrorMessagesModule,
		DropdownModule,
		ObliqueHttpModule,
		MasterLayoutModule,
		MultiselectModule,
		NotificationModule,
		OffCanvasModule,
		SchemaValidationModule,
		ScrollingModule,
		SearchBoxModule,
		SpinnerModule,
		UnsavedChangesModule,
		TranslateModule.forRoot(multiTranslateLoader()),
		AppRoutingModule,
		MasterLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		TextControlClearModule
	],
	providers: [
		{provide: OBLIQUE_THEME, useValue: THEMES.MATERIAL},
		{provide: OBLIQUE_FONT, useValue: FONTS.ROBOTO},
		{provide: HTTP_INTERCEPTORS, useClass: ObliqueHttpInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: HttpMockErrorInterceptor, multi: true}
	],
	entryComponents: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(private readonly tooltipConfig: NgbTooltipConfig,
				private readonly datepickerConfig: NgbDatepickerConfig,
				private readonly documentMetaService: DocumentMetaService,
				interceptorConfig: ObliqueHttpInterceptorConfig,
				config: MasterLayoutConfig) {
		// As the HEAD `title` element and the `description` meta element are outside any
		// Angular entry component, we use a service to update these element values:
		documentMetaService.titleSuffix = 'i18n.application.title';
		documentMetaService.description = 'i18n.application.description';

		// NgBootstrap configuration:
		tooltipConfig.container = 'body';
		datepickerConfig.navigation = 'arrows';

		interceptorConfig.api.url = HttpInterceptorSampleComponent.API_URL;
		config.locale.locales = ['en', 'fr'];
	}
}
