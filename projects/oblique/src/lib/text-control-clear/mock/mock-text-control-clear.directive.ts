import {Directive, EventEmitter, Input, Output} from '@angular/core';

@Directive({
	selector: '[orTextControlClear]',
	exportAs: 'orTextControlClear'
})
export class MockTextControlClearDirective {
	@Input('orTextControlClear') control: HTMLInputElement;
	@Input() focusOnClear = true;
	@Output() onClear = new EventEmitter<MouseEvent>();
	cssClass = true;

	onClick($event: MouseEvent): void {
	}
}
