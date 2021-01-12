import {Directive, HostBinding} from '@angular/core';

@Directive({
	selector: '[obColumnPanel]',
	exportAs: 'obColumnPanel',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-column-panel'}
})
export class ObColumnPanelDirective {
	@HostBinding('class.ob-collapsed') public collapsed = false;

	toggle(): void {
		this.collapsed = !this.collapsed;
	}
}
