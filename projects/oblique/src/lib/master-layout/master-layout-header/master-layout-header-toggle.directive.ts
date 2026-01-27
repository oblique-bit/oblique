import {Directive} from '@angular/core';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {isNotKeyboardEventOnButton} from '../../utilities';

@Directive({
	selector: '[obMasterLayoutHeaderToggle]',
	standalone: false,
	host: {
		'(click)': 'toggle($event)',
		'(keyup.enter)': 'toggle($event)',
		class: 'ob-master-layout-header-toggle',
	},
	exportAs: 'obMasterLayoutHeaderToggle',
})
export class ObMasterLayoutHeaderToggleDirective {
	constructor(private readonly masterLayout: ObMasterLayoutComponentService) {}

	toggle(event?: KeyboardEvent | MouseEvent): void {
		if (isNotKeyboardEventOnButton(event)) {
			// As ENTER keypress delegates to click events, let's ensure
			// browser does not try to follow any empty link (ie `href=""`):
			event.preventDefault();
			this.masterLayout.isMenuOpened = !this.masterLayout.isMenuOpened;
		}
	}
}
