import {Directive, EventEmitter, Input, Output} from '@angular/core';

@Directive({
	selector: '[orInputClear]',
	exportAs: 'orInputClear'
})
export class MockInputClearDirective {
	@Input('orInputClear') control: HTMLInputElement;
	@Input() focusOnClear = true;
	@Output() onClear = new EventEmitter<MouseEvent>();
	cssClass = true;

	onClick($event: MouseEvent): void {
	}
}
