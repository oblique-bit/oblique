import {Directive, HostListener} from '@angular/core';
import {ObColumnPanelDirective} from './column-panel.directive';

@Directive({
	selector: '[obColumnToggle]',
	exportAs: 'obColumnToggle',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-column-toggle'}
})
export class ObColumnToggleDirective {
	constructor(private readonly parent: ObColumnPanelDirective) {}

	@HostListener('click')
	onclick() {
		this.parent.toggle();
	}
}
