import {Component, Input, input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-column-layout',
	template: '',
	exportAs: 'obColumnLayout',
})
export class ObMockColumnLayoutComponent {
	@Input() left = true;
	@Input() right = true;
	readonly noLayout = input(false);
	readonly wider = input(false);

	toggleLeft(): void {}
	toggleRight(): void {}
}
