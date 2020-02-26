import {Directive, HostBinding} from '@angular/core';

@Directive({
	selector: '[obColumnPanel]',
	exportAs: 'obColumnPanel'
})
export class ObColumnPanelDirective {
	@HostBinding('class.collapsed') public collapsed = false;

	toggle(): void {
		this.collapsed = !this.collapsed;
	}
}
