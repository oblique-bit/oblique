import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'ob-master-layout'
})
export class ObOutlineDirective {
	@HostBinding('class.ob-outline') outline = false;

	@HostListener('mousedown')
	@HostListener('keydown')
	removeOutline(): void {
		this.outline = false;
	}

	@HostListener('keydown.tab')
	@HostListener('keydown.shift.tab')
	@HostListener('keydown.arrowUp')
	@HostListener('keydown.arrowDown')
	@HostListener('keydown.arrowRight')
	@HostListener('keydown.arrowLeft')
	addOutline(): void {
		this.outline = true;
	}
}
