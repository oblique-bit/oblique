import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgbDatepickerConfig, NgbModule, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {
	DocumentMetaModule,
	DocumentMetaService,
	ErrorMessagesModule,
	MasterLayoutConfig,
	MasterLayoutModule, MaterialConfigService,
	MultiselectModule,
	NotificationConfig,
	NotificationModule,
	ObliqueHttpInterceptor,
	ObliqueHttpInterceptorConfig,
	ObliqueHttpModule,
	OffCanvasModule,
	SchemaValidationModule,
	ScrollingModule,
	SearchBoxModule,
	SpinnerModule, TextControlClearModule,
	UnsavedChangesModule
} from 'oblique-reactive';
// App:
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomePageComponent} from './home/home.page';
import {HttpMockErrorInterceptor} from './samples/http-interceptor/http-mock-error.interceptor';
import {HttpInterceptorSampleComponent} from './samples/http-interceptor/http-interceptor-sample.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule, MatInputModule} from '@angular/material';
import { StylesComponent } from './styles/styles.component';

// AoT requires an exported function for factories:
export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		HomePageComponent,
		StylesComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		HttpClientModule,
		NgbModule,
		DocumentMetaModule,
		ErrorMessagesModule,
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
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		}),
		AppRoutingModule,
		MasterLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		TextControlClearModule
	],
	providers: [
		{
			provide: NotificationConfig,
			useValue: {
				channel: 'app',
				timeout: 5000
			}
		},
		{provide: MaterialConfigService, useValue: {enabled: false}},
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

		interceptorConfig.api.notification.config.channel = 'app';
		interceptorConfig.api.url = HttpInterceptorSampleComponent.API_URL;
		config.locale.locales = ['en', 'fr'];
	}
}
