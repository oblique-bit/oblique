import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {MasterLayoutHeaderService} from './master-layout-header.service';

@Directive({
	selector: '[orMasterLayoutHeaderToggle]',
	exportAs: 'orMasterLayoutHeaderToggle'
})
export class MasterLayoutHeaderToggleDirective {

	@Input()
	closeOnly = true;

	@Output()
	onToggle = new EventEmitter<MouseEvent>();

	constructor(private headerService: MasterLayoutHeaderService) {
	}

	@HostListener('click', ['$event'])
	onClick($event) {
		// As ENTER keypress delegates to click events, let's ensure
		// browser does not try to follow any empty link (ie `href=""`):
		$event.preventDefault();

		if(this.closeOnly) {
			this.headerService.open = false;
		} else {
			this.headerService.toggle();
		}

		// Notify toggling:
		this.onToggle.next($event);
	}
}
