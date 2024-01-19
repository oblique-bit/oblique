import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obMasterLayoutNavigationMenu]',
	exportAs: 'obMasterLayoutNavigationMenu'
})
export class ObMockMasterLayoutNavigationMenuDirective {
	hasOpenedMenu = false;
	menuOpened(): void {}
	menuClosed(): void {}
}
