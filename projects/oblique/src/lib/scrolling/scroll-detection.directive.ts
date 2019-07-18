import {Directive, HostBinding, HostListener, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ScrollingEvents} from './scrolling-events';

@Directive({
	selector: '[orScrollDetection, or-master-layout]'
})
export class ScrollDetectionDirective {
	@HostBinding('class.application-scrolling')
	private isScrolling = false;

	constructor(@Inject(DOCUMENT)
				private readonly document: any,
				private readonly scrollEvents: ScrollingEvents) {
	}

	@HostListener('window:scroll')
	private onScroll() {
		const scrollTop = window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
		if (this.isScrolling !== scrollTop > 0) {
			this.isScrolling = scrollTop > 0;
			this.scrollEvents.scroll(this.isScrolling);
		}
	}
}
