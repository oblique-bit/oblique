import {registerLocaleData} from '@angular/common';
// eslint-disable-next-line sort-imports
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import localeENUS from '@angular/common/locales/de-CH';
import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule} from '@ngx-translate/core';
import {ObSpinnerModule, multiTranslateLoader} from '@oblique/oblique';
import {HttpApiInterceptor} from './shared/http-api-interceptor/http-api-interceptor';
import {SideNavigationModule} from './side-navigation/side-navigation.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

registerLocaleData(localeENUS);

@NgModule({
	declarations: [AppComponent],
	imports: [
		AppRoutingModule,
		BrowserAnimationsModule,
		BrowserModule,
		HttpClientModule,
		ObSpinnerModule,
		SideNavigationModule,
		TranslateModule.forRoot(multiTranslateLoader())
	],
	bootstrap: [AppComponent],
	providers: [
		{provide: LOCALE_ID, useValue: 'en-US'},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpApiInterceptor,
			multi: true
		}
	]
})
export class AppModule {}
