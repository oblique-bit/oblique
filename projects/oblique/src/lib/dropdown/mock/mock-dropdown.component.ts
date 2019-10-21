import {Component, Input} from '@angular/core';

@Component({
	selector: 'or-dropdown',
	exportAs: 'orDropdown',
	template: ''
})
export class MockDropdownComponent {
	isOpen = false;
	@Input() position = 'middle';

	toggle($event?: MouseEvent): void {
	}
}
