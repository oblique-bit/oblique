import {Component, Inject, Input, ViewEncapsulation} from '@angular/core';
import {WINDOW} from '../utilities';

@Component({
	selector: 'ob-top-control',
	templateUrl: './top-control.component.html',
	styleUrls: ['./top-control.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-top-control'}
})
export class ObTopControlComponent {
	@Input() scrollTarget: HTMLElement | Window;

	constructor(@Inject(WINDOW) private readonly window: Window) {}

	public scrollTop(): void {
		(this.scrollTarget || this.window).scrollTo({top: 0, behavior: 'smooth'});
	}
}
