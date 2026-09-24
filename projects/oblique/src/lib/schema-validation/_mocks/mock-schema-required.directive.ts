import {Directive, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ngModel]',
	exportAs: 'ngModel',
})
export class ObMockSchemaRequiredDirective {
	@Input() name: string;
	required = true;
}
