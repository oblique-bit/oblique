import {DOCUMENT, Directive, Inject} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'ob-master-layout',
	standalone: false,
	host: {
		'(window:keydown)': 'removeOutline()',
		'(window:keydown.arrowDown)': 'addOutline()',
		'(window:keydown.arrowLeft)': 'addOutline()',
		'(window:keydown.arrowRight)': 'addOutline()',
		'(window:keydown.arrowUp)': 'addOutline()',
		'(window:keydown.shift.tab)': 'addOutline()',
		'(window:keydown.tab)': 'addOutline()',
		'(window:mousedown)': 'removeOutline()',
	},
})
export class ObOutlineDirective {
	constructor(@Inject(DOCUMENT) private readonly document: Document) {}

	removeOutline(): void {
		this.document.body.classList.remove('ob-outline');
	}

	addOutline(): void {
		this.document.body.classList.add('ob-outline');
	}
}
