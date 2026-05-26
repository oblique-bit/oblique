import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obMasterLayoutNavigationMenu]',
	standalone: false,
	exportAs: 'obMasterLayoutNavigationMenu',
})
export class ObMockMasterLayoutNavigationMenuDirective {
	hasOpenedMenu = false;
	menuOpened(): void {}
	menuClosed(): void {}
}
