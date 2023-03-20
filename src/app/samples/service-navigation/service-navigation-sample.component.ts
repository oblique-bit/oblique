import {Component} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
	selector: 'sc-service-navigation',
	templateUrl: './service-navigation-sample.component.html'
})
export class ServiceNavigationSampleComponent {
	readonly rootUrl = environment.pams.rootUrl;
	readonly environment = environment.pams.environment;
}
