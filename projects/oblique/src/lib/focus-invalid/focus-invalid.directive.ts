import {ContentChildren, Directive, ElementRef, HostListener, QueryList} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
	selector: 'form[obFocusInvalid]',
	standalone: true,
	exportAs: 'obFocusInvalid',
})
export class ObFocusInvalidDirective {
	@ContentChildren(NgControl, {descendants: true, read: ElementRef}) formElements: QueryList<ElementRef<HTMLElement>>;

	@HostListener('submit')
	focusFirstInvalidField(): void {
		const elements = this.formElements
			.map(element => element.nativeElement)
			.filter(element => element.classList.contains('ng-invalid'))
			// checkbox and radio buttons don't have the ng-invalid class on the focusable element
			.map(element => element.querySelector<HTMLElement>('[tabindex]') ?? element);
		if (elements.length) {
			elements[0].focus();
		}
	}
}
