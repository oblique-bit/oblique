import {Directive, ElementRef, contentChildren} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
	selector: 'form[obFocusInvalid]',
	host: {
		'(submit)': 'focusFirstInvalidField()',
	},
	exportAs: 'obFocusInvalid',
})
export class ObFocusInvalidDirective {
	readonly formElements = contentChildren(NgControl, {read: ElementRef<HTMLElement>, descendants: true});

	focusFirstInvalidField(): void {
		const elements = this.formElements()
			.map(element => element.nativeElement)
			.filter(element => element.classList.contains('ng-invalid'))
			// checkbox and radio buttons don't have the ng-invalid class on the focusable element
			.map(element => (element as HTMLElement).querySelector<HTMLElement>('[tabindex]') ?? element);
		if (elements.length) {
			elements[0].focus();
		}
	}
}
