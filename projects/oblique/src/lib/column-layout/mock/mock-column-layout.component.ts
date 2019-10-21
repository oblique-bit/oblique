import {Component, Input} from '@angular/core';

@Component({
	selector: 'or-column-layout',
	exportAs: 'orColumnLayout',
	template: ''
})
export class MockColumnLayoutComponent {
	@Input() left = true;
	@Input() right = true;

	toggleLeft(): void {
	}
	toggleRight(): void {
	}
}
