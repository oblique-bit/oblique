import {DOCUMENT, Directive, HostListener, Inject} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'ob-master-layout',
	standalone: false
})
export class ObOutlineDirective {
	constructor(@Inject(DOCUMENT) private readonly document: Document) {}

	@HostListener('window:mousedown')
	@HostListener('window:keydown')
	removeOutline(): void {
		this.document.body.classList.remove('ob-outline');
	}

	@HostListener('window:keydown.tab')
	@HostListener('window:keydown.shift.tab')
	@HostListener('window:keydown.arrowUp')
	@HostListener('window:keydown.arrowDown')
	@HostListener('window:keydown.arrowRight')
	@HostListener('window:keydown.arrowLeft')
	addOutline(): void {
		this.document.body.classList.add('ob-outline');
	}
}
