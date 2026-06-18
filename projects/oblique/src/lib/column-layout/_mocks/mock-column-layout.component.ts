import {Component, Input} from '@angular/core';

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
	@Input() noLayout = false;
	@Input() wider = false;

	toggleLeft(): void {}
	toggleRight(): void {}
}
