import {Directive, HostBinding} from '@angular/core';
import {ScrollingConfig} from './scrolling-config';

@Directive({
	selector: '[header-transition]'
})
export class HeaderTransitionDirective {
	@HostBinding('class.application-header-md')
	private mediumHeader = false;

	constructor(private config: ScrollingConfig) {
		if (config.transitionEnabled) {
			config.onScrolling.subscribe((isScrolling) => {
				this.mediumHeader = isScrolling;
			});
		}
	}
}
