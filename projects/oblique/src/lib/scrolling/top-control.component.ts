import {Component, HostBinding, Inject, Optional, ViewEncapsulation} from '@angular/core';
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
	@HostBinding('class.ob-font-awesome') useFontAwesomeIcon: boolean;

	constructor(@Inject(WINDOW) private readonly window, @Optional() @Inject(ObUseObliqueIcons) useObliqueIcon) {
		this.useFontAwesomeIcon = !useObliqueIcon;
	}

	public scrollTop(): void {
		if (this.window.scrollY) {
			this.window.scrollTo({top: 0, behavior: 'smooth'});
		}
	}
}
