import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// ObliqueReactive:
import {
	ObliqueModule, DocumentMetaService, LayoutManagerService, NotificationService
} from '../../lib';

// Layout:
import {LayoutModule} from './layout/layout.module';

// App:
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {SamplesModule} from './samples/samples.module';
import {NotificationConfig} from '../../lib/ng/notification/notification-config';

// AoT requires an exported function for factories:
export function createTranslateLoader(http: Http) {
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
		HttpModule,
		NgbModule.forRoot(),
		ObliqueModule.forRoot(), // [Note] Keep this order!
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [Http]
			}
		}),
		AppRoutingModule,
		LayoutModule,
		SamplesModule
	],
	providers: [
		DocumentMetaService,
		NotificationService,
		LayoutManagerService,
		{
			provide: NotificationConfig,
			useValue: {
				channel: 'app',
				timeout: 5000
			}
		},
		{provide: 'spinnerMaxTimeout', useValue: 3000} // TODO: export this to config service
	],
	entryComponents: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(private documentMetaService: DocumentMetaService,
				@Inject('ObliqueReactive.CONFIG') private config: any) {
		documentMetaService.titleSuffix = config.title;
		documentMetaService.description = config.description;
	}
}
