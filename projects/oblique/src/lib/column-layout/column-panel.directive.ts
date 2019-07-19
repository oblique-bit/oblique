import {Directive, HostBinding} from '@angular/core';

@Directive({
	selector: '[orColumnPanel]',
	exportAs: 'orColumnPanel'
})
export class ColumnPanelDirective {
	@HostBinding('class.collapsed') public collapsed = false;

	toggle(): void {
		this.collapsed = !this.collapsed;
	}
}
