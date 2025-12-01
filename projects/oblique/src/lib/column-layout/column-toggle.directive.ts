import {Directive, HostListener} from '@angular/core';
import {ObColumnPanelDirective} from './column-panel.directive';

@Directive({
	selector: '[obColumnToggle]',
	standalone: false,
	host: {class: 'ob-column-toggle'},
	exportAs: 'obColumnToggle',
})
export class ObColumnToggleDirective {
	constructor(private readonly parent: ObColumnPanelDirective) {}

	@HostListener('click')
	onclick(): void {
		this.parent.toggle();
	}
}
