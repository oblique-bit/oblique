import {Directive} from '@angular/core';

@Directive({
	selector: '[obMasterLayoutNavigationToggle]',
	exportAs: 'obMasterLayoutNavigationToggle'
})
export class ObMockMasterLayoutNavigationToggleDirective {
	onClick(event?: KeyboardEvent | MouseEvent): void {}
}
