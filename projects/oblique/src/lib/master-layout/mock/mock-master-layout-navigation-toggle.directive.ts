import {Directive, EventEmitter, Output} from '@angular/core';

@Directive({
	selector: '[orMasterLayoutNavigationToggle]',
	exportAs: 'orMasterLayoutNavigationToggle'
})
export class MockMasterLayoutNavigationToggleDirective {
	@Output() onToggle = new EventEmitter<MouseEvent>();
	back = false;

	onClick($event): void {
	}
}
