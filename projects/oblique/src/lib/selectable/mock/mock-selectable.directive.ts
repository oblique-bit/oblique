import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obSelectable]',
	exportAs: 'obSelectable'
})
export class ObMockSelectableDirective {
	@Input() collection = 'unnamed';
	@Input() selected = false;
	@Input() value: any;

	onClick($event: MouseEvent): void {
	}
}
