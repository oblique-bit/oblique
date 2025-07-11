import {createApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {createCustomElement} from '@angular/elements';
import {WINDOW, windowProvider} from '../../oblique/src/lib/utilities';
import {ObServiceNavigationWebComponentComponent} from './app/service-navigation-web-component.component';
import {DOCUMENT, inject, provideAppInitializer} from '@angular/core';
import {ObIconService, provideObliqueTranslations} from '@oblique/oblique';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

createApplication({
	providers: [
		provideHttpClient(),
		provideAnimations(),
		provideAppInitializer(() => inject(ObIconService).registerOnAppInit({registerObliqueIcons: true})),
		provideObliqueTranslations(),
		{provide: WINDOW, useFactory: windowProvider, deps: [DOCUMENT]},
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
	]
})
	.then(appRef => {
		const element = createCustomElement(ObServiceNavigationWebComponentComponent, {injector: appRef.injector});

		customElements.define('ob-service-navigation-web-component', element);
	})
	.catch((error: unknown) => console.error(error));
