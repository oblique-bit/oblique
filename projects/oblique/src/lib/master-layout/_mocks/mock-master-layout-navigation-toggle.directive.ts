import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obMasterLayoutNavigationToggle]',
	exportAs: 'obMasterLayoutNavigationToggle',
	standalone: false
})
export class ObMockMasterLayoutNavigationToggleDirective {
	onClick(event?: KeyboardEvent | MouseEvent): void {}
}
