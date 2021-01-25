import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';
import {WINDOW} from '../utilities';

@Component({
	selector: 'ob-top-control',
	templateUrl: './top-control.component.html',
	styleUrls: ['top-control.component.scss'],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-top-control'}
})
export class ObTopControlComponent {
	private readonly window: Window;
	constructor(private readonly config: ObMasterLayoutConfig, @Inject(WINDOW) window) {
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
