import {Component, Inject, OnInit} from '@angular/core';
import {WINDOW} from '@oblique/oblique';
import {environment} from '../../../environments/environment';

@Component({
	selector: 'sc-service-navigation',
	templateUrl: './service-navigation-sample.component.html'
})
export class ServiceNavigationSampleComponent implements OnInit {
	returnUrl: string;
	readonly rootUrl = environment.pams.rootUrl;
	readonly environment = environment.pams.environment;

	constructor(@Inject(WINDOW) private readonly window: Window) {}

	ngOnInit(): void {
		this.returnUrl = this.window.location.href;
	}
}
