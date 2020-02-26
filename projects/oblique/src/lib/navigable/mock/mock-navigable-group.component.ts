import {Component, EventEmitter, Input, Output, QueryList} from '@angular/core';
import {ObNavigableDirective} from '../navigable.directive';

@Component({
	selector: 'ob-navigable-group',
	exportAs: 'obNavigableGroup',
	template: `
		<ng-content></ng-content>`
})
export class ObMockNavigableGroupComponent {
	@Input('items') items: any[];
	@Input('selection') selection;
	navigables: QueryList<ObNavigableDirective>;
	@Output() selectionOnChange = new EventEmitter();

	add(model: any): void {
	}

	remove(model: any): void {
	}
}
