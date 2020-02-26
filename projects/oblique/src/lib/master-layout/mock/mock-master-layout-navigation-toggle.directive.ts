import {Directive, EventEmitter, Output} from '@angular/core';

@Directive({
	selector: '[obMasterLayoutNavigationToggle]',
	exportAs: 'obMasterLayoutNavigationToggle'
})
export class ObMockMasterLayoutNavigationToggleDirective {
	@Output() onToggle = new EventEmitter<MouseEvent>();
	back = false;

	onClick($event): void {
	}
}
