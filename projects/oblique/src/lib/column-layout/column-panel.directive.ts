import {Directive, EventEmitter, HostBinding, Output} from '@angular/core';

@Directive({
	selector: '[obColumnPanel]',
	exportAs: 'obColumnPanel',
	host: {class: 'ob-column-panel'}
})
export class ObColumnPanelDirective {
	@HostBinding('class.ob-collapsed') public collapsed = false;
	@Output() readonly toggled = new EventEmitter<boolean>();

	toggle(): void {
		this.collapsed = !this.collapsed;
		this.toggled.emit(this.collapsed);
	}
}
