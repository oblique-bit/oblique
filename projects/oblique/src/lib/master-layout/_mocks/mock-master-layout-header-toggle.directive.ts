import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obMasterLayoutHeaderToggle]',
	exportAs: 'obMasterLayoutHeaderToggle',
	standalone: false
})
export class ObMockMasterLayoutHeaderToggleDirective {
	toggle($event): void {}
}
