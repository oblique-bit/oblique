import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// ObliqueReactive:
import {
	ObliqueModule,
	DocumentMetaService,
	MasterLayoutModule,
	MasterLayoutApplicationService,
	NotificationService,
	NotificationConfig
} from '../../lib';

// Layout:
import {LayoutModule} from './layout/layout.module';

// App:
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {SamplesModule} from './samples/samples.module';

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
		LayoutModule,
		SamplesModule
	],
	providers: [
		DocumentMetaService,
		NotificationService,
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
	constructor(documentMetaService: DocumentMetaService,
				@Inject('ObliqueReactive.CONFIG') private config: any) {
		documentMetaService.titleSuffix = config.title;
		documentMetaService.description = config.description;
	}
}
