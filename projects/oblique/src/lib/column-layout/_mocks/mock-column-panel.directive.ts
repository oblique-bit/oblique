import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obColumnPanel]',
	exportAs: 'obColumnPanel',
})
export class ObMockColumnPanelDirective {
	toggle(): void {}
}
