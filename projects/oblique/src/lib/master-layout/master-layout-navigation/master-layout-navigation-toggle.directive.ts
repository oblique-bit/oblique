import {Directive} from '@angular/core';
import {isNotKeyboardEventOnButton} from '../../utilities';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';

@Directive({
	selector: '[obMasterLayoutNavigationToggle]',
	standalone: false,
	host: {
		'(click)': 'onClick($event)',
		'(keyup.enter)': 'onClick($event)',
		class: 'ob-master-layout-navigation-toggle',
	},
	exportAs: 'obMasterLayoutNavigationToggle',
})
export class ObMasterLayoutNavigationToggleDirective {
	constructor(private readonly item: ObMasterLayoutNavigationItemDirective) {}

	onClick(event?: KeyboardEvent | MouseEvent): void {
		if (isNotKeyboardEventOnButton(event)) {
			// As ENTER keypress delegates to click events, let's ensure
			// browser does not try to follow any empty link (ie `href=""`):
			event.preventDefault();
			this.item.toggleSubMenu();
		}
	}
}
