import {Directive, HostListener} from '@angular/core';
import {ObColumnPanelDirective} from './column-panel.directive';

@Directive({
	selector: '[obColumnToggle]',
	exportAs: 'obColumnToggle',
	host: {class: 'ob-column-toggle'}
})
export class ObColumnToggleDirective {
	constructor(private readonly parent: ObColumnPanelDirective) {}

	@HostListener('click')
	onclick() {
		this.parent.toggle();
	}
}
