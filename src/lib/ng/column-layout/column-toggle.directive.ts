import {Directive, HostListener} from '@angular/core';
import {ColumnPanelDirective} from './column-panel.directive';

@Directive({
	selector: '[orColumnToggle]',
	exportAs: 'orColumnToggle'
})
export class ColumnToggleDirective {

	constructor(private readonly parent: ColumnPanelDirective) {
	}

	@HostListener('click')
	onclick() {
		this.parent.toggle();
	}
}
