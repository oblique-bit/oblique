import {Directive, HostListener} from '@angular/core';
import {ObColumnPanelDirective} from './column-panel.directive';

@Directive({
	selector: '[obColumnToggle]',
	exportAs: 'obColumnToggle',
	host: {class: 'ob-column-toggle'},
	standalone: false
})
export class ObColumnToggleDirective {
	constructor(private readonly parent: ObColumnPanelDirective) {}

	@HostListener('click')
	onclick(): void {
		this.parent.toggle();
	}
}
