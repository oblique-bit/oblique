import {Component, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-column-layout',
	standalone: false,
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
