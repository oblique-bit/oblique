import {Component, ElementRef, Input} from '@angular/core';

/**
 * TODO: refactor this with a better approach.
 */
@Component({
	selector: 'branding-app-title',
	templateUrl: './app-title.component.html'
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

	constructor(elm: ElementRef) {
		// As properties of root components are not binded, let's do it manually:
		this.home = elm.nativeElement.attributes['[home]'].value;
		this.title = elm.nativeElement.attributes['[title]'].value;
	}
}
