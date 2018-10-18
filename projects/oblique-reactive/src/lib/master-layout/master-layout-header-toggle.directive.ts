import {Directive, HostListener} from '@angular/core';
import {MasterLayoutService} from './master-layout.service';

@Directive({
	selector: '[orMasterLayoutHeaderToggle]',
	exportAs: 'orMasterLayoutHeaderToggle'
})
export class MasterLayoutHeaderToggleDirective {

	constructor(
		private readonly masterLayout: MasterLayoutService) {
	}

	@HostListener('click', ['$event'])
	toggle($event) {
		// As ENTER keypress delegates to click events, let's ensure
		// browser does not try to follow any empty link (ie `href=""`):
		$event.preventDefault();
		this.masterLayout.menuCollapsed = !this.masterLayout.menuCollapsed;

	}
}
