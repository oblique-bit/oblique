import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obMasterLayoutNavigationItem]',
	standalone: false,
	exportAs: 'obMasterLayoutNavigationItem',
})
export class ObMockMasterLayoutNavigationItemDirective {
	isExpanded = false;
	toggleSubMenu(): void {}
	openSubMenu(): void {}
	closeSubMenu(closeMainMenu = true): void {}
}
