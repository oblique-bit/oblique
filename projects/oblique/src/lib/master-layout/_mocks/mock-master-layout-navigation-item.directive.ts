import {Directive} from '@angular/core';

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
