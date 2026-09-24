import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.ob-off-canvas, ob-master-layout',
})
export class ObMockOffCanvasContainerDirective {
	open = false;
}
