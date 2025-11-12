import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obColumnPanel]',
	standalone: false,
	exportAs: 'obColumnPanel',
})
export class ObMockColumnPanelDirective {
	toggle(): void {}
}
