import {NgModule, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgbDatepickerConfig, NgbModule, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// ObliqueReactive:
import {
	ObliqueModule,
	DocumentMetaService,
	MasterLayoutModule,
	MasterLayoutApplicationService,
	NotificationService,
	NotificationConfig,
	SchemaValidationService
} from '../../lib';

// Layout:
import {LayoutModule} from './layout/layout.module';

// App:
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';

// AoT requires an exported function for factories:
export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent
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
		MasterLayoutModule,
		LayoutModule
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
		}
	],
	entryComponents: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(private translate: TranslateService,
				private tooltipConfig: NgbTooltipConfig,
				private datepickerConfig: NgbDatepickerConfig,
				private documentMetaService: DocumentMetaService,
				@Inject('ObliqueReactive.CONFIG') private config: any) {
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
	}
}
