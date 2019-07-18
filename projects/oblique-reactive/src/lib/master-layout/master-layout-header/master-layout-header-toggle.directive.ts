import {Directive, HostListener} from '@angular/core';
import {MasterLayoutComponentService} from '../master-layout/master-layout-component.service';

@Directive({
	selector: '[orMasterLayoutHeaderToggle]',
	exportAs: 'orMasterLayoutHeaderToggle'
})
export class MasterLayoutHeaderToggleDirective {

	constructor(private readonly masterLayout: MasterLayoutComponentService) {
	}

	@HostListener('click', ['$event'])
	@HostListener('keyup.enter', ['$event'])
	toggle($event) {
		// As ENTER keypress delegates to click events, let's ensure
		// browser does not try to follow any empty link (ie `href=""`):
		$event.preventDefault();
		this.masterLayout.isMenuOpened = !this.masterLayout.isMenuOpened;
	}
}
