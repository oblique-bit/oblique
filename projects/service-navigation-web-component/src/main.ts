import {createApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {importProvidersFrom} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {provideTranslateService} from '@ngx-translate/core';
import {ObIconModule} from '../../oblique/src/lib/icon/icon.module';
import {multiTranslateLoader} from '../../oblique/src/lib/utilities';
import {ObServiceNavigationWebComponentComponent} from './app/service-navigation-web-component.component';

createApplication({
	providers: [
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
