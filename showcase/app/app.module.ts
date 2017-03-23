import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';

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
import {NavigableSampleComponent} from './samples/navigable/navigable.sample.component';
import {SchemaValidationComponent} from './samples/schema-validation/schema-validation.component';
import {UnsavedChangesGuard} from '../../src/unsaved-changes/unsaved-changes.guard';

// TODO: refactor when https://github.com/angular/angular/issues/7136
import {ApplicationRef, ComponentFactoryResolver, Type, OpaqueToken} from '@angular/core';
export const BOOTSTRAP_COMPONENTS_TOKEN = new OpaqueToken('bootstrap_components');


export function createTranslateLoader(http: Http) {
	return new TranslateStaticLoader(http, './assets/i18n', '.json');
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
			provide: TranslateLoader,
			useFactory: createTranslateLoader,
			deps: [Http]
		}),
		LayoutModule,
		SamplesModule,
		AppRoutingModule
	],
	providers: [
		{provide: 'notificationTimeout', useValue: 2000},
		{provide: 'spinnerMaxTimeout', useValue: 3000},
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
	            @Inject(BOOTSTRAP_COMPONENTS_TOKEN) private components) {
	}

	ngDoBootstrap(appRef: ApplicationRef) {
		this.components.forEach((componentDef: {type: Type<any>, selector: string}) => {
			const factory = this.resolver.resolveComponentFactory(componentDef.type);
			factory.selector = componentDef.selector;
			appRef.bootstrap(factory);
		});
	}
}
