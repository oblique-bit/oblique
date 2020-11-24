import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obSelectable]',
	exportAs: 'obSelectable'
})
export class ObMockSelectableDirective {
	@Input() selected = false;
	@Input() tabindex = 0;
	@Input() value: any;
	cursor = 'pointer';
	role = 'checkbox';

	onClick($event: KeyboardEvent | MouseEvent): void {}

	onFocus(): void {}

	focus(): void {}
}
