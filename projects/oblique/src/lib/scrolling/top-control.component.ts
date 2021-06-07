import {Component, HostBinding, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';
import {WINDOW} from '../utilities';
import {ObUseObliqueIcons} from '../icon/icon.model';

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
	@HostBinding('class.ob-font-awesome') useFontAwesomeIcon: boolean;

	constructor(private readonly config: ObMasterLayoutConfig, @Inject(WINDOW) window, @Optional() @Inject(ObUseObliqueIcons) useObliqueIcon) {
		this.window = window; // because AoT don't accept interfaces as DI
		this.useFontAwesomeIcon = !useObliqueIcon;
	}

	public scrollTop(): void {
		const scrollStep = this.window.scrollY / (this.config.scrollToTopDuration / 15);
		this.scrollToTop(scrollStep);
	}

	private scrollToTop(scrollStep: number): void {
		if (this.window.scrollY) {
			this.window.scrollBy(0, -scrollStep);
			this.window.setTimeout(() => this.scrollToTop(scrollStep), 15);
		}
	}
}
