import {Component, Inject} from '@angular/core';

/**
 * TODO: refactor this with a better approach (single root component & @Input).
 */
@Component({
	selector: 'branding-app-title',
	templateUrl: './app-title.component.html'
})
export class BrandingAppTitleComponent {

	/**
	 * The router link for the default home state.
	 */
	home: string;

	/**
	 * The application title.
	 */
	title: string;

	constructor(@Inject('ObliqueReactive.CONFIG') private config: any) {
		this.home = config.home;
		this.title = config.title;
	}
}
