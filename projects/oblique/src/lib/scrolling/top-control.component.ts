import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MasterLayoutConfig} from '../master-layout/master-layout.config';
import {WINDOW} from '../utilities';

@Component({
	selector: 'or-top-control',
	templateUrl: './top-control.component.html',
	styleUrls: ['top-control.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TopControlComponent {
	private readonly window: Window;
	constructor(private readonly config: MasterLayoutConfig, @Inject(WINDOW) window) {
		this.window = window; // because AoT don't accept interfaces as DI
	}

	public scrollTop(): void {
		const scrollStep = this.window.scrollY / (this.config.scrollToTopDuration / 15);
		this.scrollToTop(scrollStep);
	}

	private scrollToTop(scrollStep: number): void {
		if (this.window.scrollY) {
			this.window.scrollBy(0, -scrollStep);
			setTimeout(() => this.scrollToTop(scrollStep), 15);
		}
	}
}
