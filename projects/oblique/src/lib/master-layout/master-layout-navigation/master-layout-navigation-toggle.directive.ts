import {Directive, HostListener} from '@angular/core';
import {isNotKeyboardEventOnButton} from '../../utilities';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';

@Directive({
	selector: '[obMasterLayoutNavigationToggle]',
	exportAs: 'obMasterLayoutNavigationToggle',
	host: {class: 'ob-master-layout-navigation-toggle'}
})
export class ObMasterLayoutNavigationToggleDirective {
	constructor(private readonly item: ObMasterLayoutNavigationItemDirective) {}

	@HostListener('click', ['$event'])
	@HostListener('keyup.enter', ['$event'])
	onClick(event?: KeyboardEvent | MouseEvent): void {
		if (isNotKeyboardEventOnButton(event)) {
			// As ENTER keypress delegates to click events, let's ensure
			// browser does not try to follow any empty link (ie `href=""`):
			event.preventDefault();
			this.item.toggleSubMenu();
		}
	}
}
