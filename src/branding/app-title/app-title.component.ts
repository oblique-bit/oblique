import {Component, Input} from '@angular/core';

@Component({
	selector: 'branding-app-title',
	template: `
		<a [routerLink]="[home]" class="application-brand-link">
			{{title}}
		</a>
	`
})
export class BrandingAppTitleComponent {

	/**
	 * The router link for the default home state.
	 */
	@Input()
	home: string;

	/**
	 * The application title.
	 */
	@Input()
	title: string;
}
