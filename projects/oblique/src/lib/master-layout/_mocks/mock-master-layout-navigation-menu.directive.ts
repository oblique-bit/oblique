import {Directive} from '@angular/core';

@Directive({
	selector: '[obMasterLayoutNavigationMenu]',
	exportAs: 'obMasterLayoutNavigationMenu'
})
export class ObMockMasterLayoutNavigationMenuDirective {
	hasOpenedMenu = false;
	menuOpened(): void {}
	menuClosed(): void {}
}
