import {Directive, EventEmitter, Input, Output} from '@angular/core';

@Directive({
	selector: '[obInputClear]',
	exportAs: 'obInputClear'
})
export class ObMockInputClearDirective {
	@Input('obInputClear') control: HTMLInputElement;
	@Input() focusOnClear = true;
	@Output() onClear = new EventEmitter<MouseEvent>();
	cssClass = true;

	onClick($event: MouseEvent): void {
	}
}
