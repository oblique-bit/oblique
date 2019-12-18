import {Component, EventEmitter, Input, Output, QueryList} from '@angular/core';
import {NavigableDirective} from '../navigable.directive';

@Component({
	selector: 'or-navigable-group',
	exportAs: 'orNavigableGroup',
	template: `
		<ng-content></ng-content>`
})
export class MockNavigableGroupComponent {
	@Input('items') items: any[];
	@Input('selection') selection;
	navigables: QueryList<NavigableDirective>;
	@Output() selectionOnChange = new EventEmitter();

	add(model: any): void {
	}

	remove(model: any): void {
	}
}
