import {createApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {importProvidersFrom} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {provideTranslateService} from '@ngx-translate/core';
import {ObIconModule} from '../../oblique/src/lib/icon/icon.module';
import {WINDOW, multiTranslateLoader} from '../../oblique/src/lib/utilities';
import {ObServiceNavigationWebComponentComponent} from './app/service-navigation-web-component.component';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS} from '@angular/material/slide-toggle';
import {MAT_TABS_CONFIG} from '@angular/material/tabs';

createApplication({
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
		{provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
		{provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
		{provide: MAT_TABS_CONFIG, useValue: {stretchTabs: false}},
		{provide: WINDOW, useValue: window},
		provideHttpClient(),
		importProvidersFrom(ObIconModule.forRoot()),
		provideTranslateService(multiTranslateLoader()),
		provideAnimations()
	]
})
	.then(appRef => {
		const element = createCustomElement(ObServiceNavigationWebComponentComponent, {injector: appRef.injector});

		customElements.define('ob-service-navigation-web-component', element);
	})
	.catch((error: unknown) => console.error(error));
