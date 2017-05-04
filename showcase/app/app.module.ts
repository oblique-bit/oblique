import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Inject, ApplicationRef, ComponentFactoryResolver} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// ObliqueReactive:
import {
	ObliqueModule, DocumentMetaService, LayoutManagerService,
	BrandingAppTitleComponent, SpinnerComponent, TopControlComponent
} from '../../src';

// Layout:
import {LayoutModule} from './layout/layout.module';
import {LayoutControlsComponent} from './layout/controls/controls.component';
import {LayoutNavigationComponent} from './layout/navigation/navigation.component';

// App:
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {SamplesModule} from './samples/samples.module';
import {Ng2Webstorage} from 'ngx-webstorage';

// Root components:
export const ENTRY_COMPONENTS = [
	AppComponent,
	BrandingAppTitleComponent,
	SpinnerComponent,
	TopControlComponent,
	LayoutControlsComponent,
	LayoutNavigationComponent
];

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
		FormsModule,
		HttpModule,
		ObliqueModule.forRoot(),
		Ng2Webstorage.forRoot({prefix: 'oblique'}),
		NgbModule.forRoot(),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [Http]
			}
		}),
		LayoutModule,
		SamplesModule,
		AppRoutingModule
	],
	providers: [
		DocumentMetaService,
		LayoutManagerService,
		{provide: 'notificationTimeout', useValue: 2000},
		{provide: 'spinnerMaxTimeout', useValue: 3000}
	],
	entryComponents: ENTRY_COMPONENTS
	// bootstrap: [AppComponent]
})
export class AppModule {
	constructor(private resolver: ComponentFactoryResolver,
	            private translate: TranslateService,
	            private documentMetaService: DocumentMetaService,
	            private uiLayoutService: LayoutManagerService, // Service instantiation only!
	            @Inject('ObliqueReactive.CONFIG') private config: any) {
		translate.setDefaultLang((this.config.defaults && this.config.defaults.locale) || 'en');
		documentMetaService.titleSuffix = config.title;
		documentMetaService.description = config.description;
	}

	ngDoBootstrap(appRef: ApplicationRef) {
		ENTRY_COMPONENTS.forEach((component) => {
			const factory = this.resolver.resolveComponentFactory(component);
			appRef.bootstrap(factory);
		});
	}
}
