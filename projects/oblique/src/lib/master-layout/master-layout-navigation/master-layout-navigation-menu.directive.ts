import {Directive, HostBinding} from '@angular/core';

@Directive({
	selector: '[obMasterLayoutNavigationMenu]',
	exportAs: 'obMasterLayoutNavigationMenu',
	host: {class: 'ob-master-layout-navigation-menu'}
})
export class ObMasterLayoutNavigationMenuDirective {
	@HostBinding('class.ob-has-opened-menu') public hasOpenedMenu = false;
	private counter = 0;

	menuOpened(): void {
		this.counter++;
		this.hasOpenedMenu = this.counter > 0;
	}

	menuClosed(): void {
		this.counter--;
		this.hasOpenedMenu = this.counter > 0;
	}
}
