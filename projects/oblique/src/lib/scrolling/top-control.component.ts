import {Component, HostBinding, Inject, Input, Optional, ViewEncapsulation} from '@angular/core';
import {ObUseObliqueIcons} from '../icon/icon.model';
import {WINDOW} from '../utilities';

@Component({
	selector: 'ob-top-control',
	templateUrl: './top-control.component.html',
	styleUrls: ['./top-control.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-top-control'}
})
export class ObTopControlComponent {
	@HostBinding('class.ob-font-awesome') useFontAwesomeIcon: boolean;
	@Input() scrollTarget: HTMLElement | Window;

	constructor(@Inject(WINDOW) private readonly window: Window, @Optional() @Inject(ObUseObliqueIcons) useObliqueIcon) {
		this.useFontAwesomeIcon = !(useObliqueIcon ?? true);
	}

	public scrollTop(): void {
		(this.scrollTarget || this.window).scrollTo({top: 0, behavior: 'smooth'});
	}
}
