import {Directive, HostBinding, HostListener, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ScrollingConfig} from './scrolling-config';

@Directive({
	selector: '[orScrollDetection]'
})
export class ScrollDetectionDirective {
	@HostBinding('class.application-scrolling')
	private isScrolling = false;

	@HostListener('window:scroll')
	private onScroll() {
		const scrollTop = window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
		if (this.isScrolling !== scrollTop > 0) {
			this.isScrolling = scrollTop > 0;
			this.config.onScroll.emit(this.isScrolling);
		}
	}

	constructor(@Inject(DOCUMENT) private document: any, private config: ScrollingConfig) {
	}
}
