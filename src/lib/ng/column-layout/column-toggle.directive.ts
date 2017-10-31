import {Directive, HostListener} from '@angular/core';
import {ColumnPanelDirective} from "./column-panel.directive";

@Directive({
	selector: '[orColumnToggle]',
	exportAs: 'orColumnToggle'
})
export class ColumnToggleDirective {

	@HostListener('click')
	onclick() {
		this.parent.toggle();
	}

	constructor(private parent: ColumnPanelDirective) {
	}
}
