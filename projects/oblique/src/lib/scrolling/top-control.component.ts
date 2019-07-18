import {Component, ViewEncapsulation} from '@angular/core';
import {MasterLayoutConfig} from '../master-layout/master-layout.config';

@Component({
	selector: 'or-top-control',
	templateUrl: './top-control.component.html',
	styleUrls: ['top-control.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TopControlComponent {
	constructor(private readonly config: MasterLayoutConfig) {
	}

	public scrollTop(): void {
		const scrollStep = window.scrollY / (this.config.scrollToTopDuration / 15);
		this.scrollToTop(scrollStep);
	}

	private scrollToTop(scrollStep: number): void {
		if (window.scrollY) {
			window.scrollBy(0, -scrollStep);
			setTimeout(() => this.scrollToTop(scrollStep), 15);
		}
	}
}
