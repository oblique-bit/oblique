import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obColumnPanel]',
	exportAs: 'obColumnPanel',
	standalone: false
})
export class ObMockColumnPanelDirective {
	toggle(): void {}
}
