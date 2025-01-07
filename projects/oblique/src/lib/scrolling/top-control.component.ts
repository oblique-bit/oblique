import {Component, EventEmitter, Inject, Input, Output, ViewEncapsulation} from '@angular/core';
import {WINDOW} from '../utilities';
import {TranslateModule} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';

@Component({
	selector: 'ob-top-control',
	templateUrl: './top-control.component.html',
	styleUrls: ['./top-control.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-top-control'},
	imports: [MatIconModule, TranslateModule]
})
export class ObTopControlComponent {
	@Input() scrollTarget: HTMLElement | Window;
	@Output() readonly scrollToTop = new EventEmitter<void>();

	constructor(@Inject(WINDOW) private readonly window: Window) {}

	public scrollTop(): void {
		this.scrollTarget?.scrollTo({top: 0, behavior: 'smooth'});
		this.scrollToTop.emit();
	}
}
