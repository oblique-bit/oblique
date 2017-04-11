import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// ObliqueReactive:
import {ObliqueModule, SpinnerComponent, TopControlComponent} from '../../src';

// Layout:
import {LayoutModule} from './layout/layout.module';
import {LayoutControlsComponent} from './layout/controls/controls.component';
import {LayoutNavigationComponent} from './layout/navigation/navigation.component';

// App:
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home/home.component';
import {SamplesModule} from './samples/samples.module';

// TODO: refactor when https://github.com/angular/angular/issues/7136
import {ApplicationRef, ComponentFactoryResolver, Type, InjectionToken} from '@angular/core';
import {DocumentMetaService} from '../../src/document-meta/document-meta.service';

export const BOOTSTRAP_COMPONENTS_TOKEN = new InjectionToken('bootstrap_components');

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
		{provide: 'notificationTimeout', useValue: 2000},
		{provide: 'spinnerMaxTimeout', useValue: 3000}
	],
	entryComponents: [
		AppComponent,
		SpinnerComponent,
		TopControlComponent,
		LayoutControlsComponent,
		LayoutNavigationComponent
	]
	// bootstrap: [AppComponent]
})
export class AppModule {
	constructor(private resolver: ComponentFactoryResolver,
	            private translate: TranslateService,
	            private documentMetaService: DocumentMetaService,
	            @Inject(BOOTSTRAP_COMPONENTS_TOKEN) private components,
	            @Inject('ObliqueReactive.CONFIG') private config: any) {

		translate.setDefaultLang('en');
		translate.use('en');
		documentMetaService.titleSuffix = config.title;
		documentMetaService.description = config.description;
	}

	ngDoBootstrap(appRef: ApplicationRef) {
		this.components.forEach((componentDef: {type: Type<any>, selector: string}) => {
			const factory = this.resolver.resolveComponentFactory(componentDef.type);
			appRef.bootstrap(factory);
		});
	}
}
