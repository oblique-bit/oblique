import {Directive, EventEmitter, Output} from '@angular/core';

@Directive({
	selector: '[obMasterLayoutNavigationToggle]',
	exportAs: 'obMasterLayoutNavigationToggle'
})
export class ObMockMasterLayoutNavigationToggleDirective {
	// eslint-disable-next-line @angular-eslint/no-output-on-prefix
	@Output() readonly onToggle = new EventEmitter<MouseEvent>();
	back = false;

	onClick($event): void {}
}
