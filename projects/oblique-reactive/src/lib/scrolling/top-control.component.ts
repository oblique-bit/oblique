import {Component} from '@angular/core';
import { MasterLayoutConfig } from '../master-layout/master-layout.config';

@Component({
	selector: 'or-top-control',
	template: `
		<a class="top-control" role="button" tabindex="0" (click)="scrollTop()">
			<span class="control-icon fa fa-angle-up"></span>
			<span class="control-label">{{'i18n.topControl.backToTop' | translate}}</span>
		</a>`
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
