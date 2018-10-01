import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
	selector: '[orMasterLayoutNavigationToggle]',
	exportAs: 'orMasterLayoutNavigationToggle'
})
export class MasterLayoutNavigationToggleDirective {

	@Output()
	onToggle = new EventEmitter<MouseEvent>();

	public back = false;

	constructor(private readonly elementRef: ElementRef) {
		this.back = elementRef.nativeElement.classList.contains('navbar-primary-back');
	}

	@HostListener('click', ['$event'])
	onClick($event) {
		// As ENTER keypress delegates to click events, let's ensure
		// browser does not try to follow any empty link (ie `href=""`):
		$event.preventDefault();

		// Notify toggling:
		this.onToggle.next($event);
	}
}
