import {Component, Input} from '@angular/core';

@Component({
	selector: 'ob-column-layout',
	exportAs: 'obColumnLayout',
	template: ''
})
export class ObMockColumnLayoutComponent {
	@Input() left = true;
	@Input() right = true;
	@Input() noLayout = false;
	@Input() wider = false;

	toggleLeft(): void {}
	toggleRight(): void {}
}
