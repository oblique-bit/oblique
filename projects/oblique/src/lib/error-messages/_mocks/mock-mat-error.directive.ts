import {Directive} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'mat-error',
	standalone: true
})
export class ObMockMatErrorDirective {}
