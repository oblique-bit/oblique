import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obMasterLayoutNavigationItem]',
	exportAs: 'obMasterLayoutNavigationItem'
})
export class ObMockMasterLayoutNavigationItemDirective {
	isExpanded = false;
	toggleSubMenu(): void {}
	openSubMenu(): void {}
	closeSubMenu(closeMainMenu = true): void {}
}
