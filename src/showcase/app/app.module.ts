import {Inject, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgbDatepickerConfig, NgbModule, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// ObliqueReactive:
import {
	DocumentMetaService,
	MasterLayoutApplicationService,
	MasterLayoutModule,
	NotificationConfig,
	NotificationService,
	ObliqueHttpInterceptorConfig,
	ObliqueModule,
	SchemaValidationService
} from '../../lib';

// App:
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomePageComponent} from './home/home.page';
import {HttpMockErrorInterceptor} from './samples/http-interceptor/http-mock-error.interceptor';
import {ObliqueHttpInterceptor} from '../../lib/ng/http/oblique-http-interceptor';

// AoT requires an exported function for factories:
export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
		NgbModule.forRoot(),
		ObliqueModule.forRoot(), // [Note] Keep this order!
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [HttpClient]
			}
		}),
		AppRoutingModule,
		MasterLayoutModule
	],
	providers: [
		DocumentMetaService,
		NotificationService,
		SchemaValidationService,
		MasterLayoutApplicationService,
		{
			provide: NotificationConfig,
			useValue: {
				channel: 'app',
				timeout: 5000
			}
		},
		{provide: HTTP_INTERCEPTORS, useClass: ObliqueHttpInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: HttpMockErrorInterceptor, multi: true}
	],
	entryComponents: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(private readonly translate: TranslateService,
				private readonly tooltipConfig: NgbTooltipConfig,
				private readonly datepickerConfig: NgbDatepickerConfig,
				private readonly documentMetaService: DocumentMetaService,
				interceptorConfig: ObliqueHttpInterceptorConfig,
				@Inject('ObliqueReactive.CONFIG') private readonly config: any) {
		// As the HEAD `title` element and the `description` meta element are outside any
		// Angular entry component, we use a service to update these element values:
		documentMetaService.titleSuffix = 'i18n.application.title';
		documentMetaService.description = 'i18n.application.description';

		// Default i18n configuration:
		translate.setDefaultLang(config.defaults.locale || 'en');
		translate.use(config.defaults.locale || 'en');

		// NgBootstrap configuration:
		tooltipConfig.container = 'body';
		datepickerConfig.navigation = 'arrows';

		interceptorConfig.api.notification.config.channel = 'app';
	}
}
