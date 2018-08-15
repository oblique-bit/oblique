import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';

import {MasterLayoutHeaderService} from './master-layout-header.service';
import {MasterLayoutService} from './master-layout.service';

@Directive({
	selector: '[orMasterLayoutHeaderToggle]',
	exportAs: 'orMasterLayoutHeaderToggle'
})
export class MasterLayoutHeaderToggleDirective {
	// @deprecated
	@Input()
	closeOnly = true;

	// @deprecated
	@Output()
	onToggle = new EventEmitter<MouseEvent>();

	constructor(private readonly headerService: MasterLayoutHeaderService, private readonly masterLayout: MasterLayoutService) {
	}

	@HostListener('click', ['$event'])
	onClick($event) {
		// As ENTER keypress delegates to click events, let's ensure
		// browser does not try to follow any empty link (ie `href=""`):
		$event.preventDefault();
		this.masterLayout.menuCollapsed = !this.masterLayout.menuCollapsed;

		// @deprecated
		if (this.closeOnly) {
			this.headerService.open = false;
		} else {
			this.headerService.toggle();
		}

		// Notify toggling:
		this.onToggle.next($event);
	}
}
