import {createApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {createCustomElement} from '@angular/elements';
import {provideObliqueConfiguration} from '../../oblique/src/lib/utilities';
import {ObServiceNavigationWebComponentComponent} from './app/service-navigation-web-component.component';

createApplication({
	providers: [provideHttpClient(), provideAnimations(), provideObliqueConfiguration()]
})
	.then(appRef => {
		const element = createCustomElement(ObServiceNavigationWebComponentComponent, {injector: appRef.injector});

		customElements.define('ob-service-navigation-web-component', element);
	})
	.catch((error: unknown) => console.error(error));
