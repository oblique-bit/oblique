import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
	selector: '[obMasterLayoutNavigationToggle]',
	exportAs: 'obMasterLayoutNavigationToggle',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-master-layout-navigation-toggle'}
})
export class ObMasterLayoutNavigationToggleDirective {
	@Output()
	onToggle = new EventEmitter<MouseEvent>();

	public back = false;

	constructor(private readonly elementRef: ElementRef) {
		this.back = elementRef.nativeElement.classList.contains('navbar-primary-back');
	}

	@HostListener('click', ['$event'])
	@HostListener('keyup.enter', ['$event'])
	onClick($event) {
		// As ENTER keypress delegates to click events, let's ensure
		// browser does not try to follow any empty link (ie `href=""`):
		$event.preventDefault();

		// Notify toggling:
		this.onToggle.next($event);
	}
}
