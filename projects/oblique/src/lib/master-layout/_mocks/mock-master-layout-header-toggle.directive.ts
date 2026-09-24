import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obMasterLayoutHeaderToggle]',
	standalone: false,
	exportAs: 'obMasterLayoutHeaderToggle',
})
export class ObMockMasterLayoutHeaderToggleDirective {
	toggle($event): void {}
}
