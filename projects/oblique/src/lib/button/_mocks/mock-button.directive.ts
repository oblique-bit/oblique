import {Directive, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obButton]',
	exportAs: 'obButton',
})
export class ObMockButtonDirective {
	@Input() obButton = 'primary';
}
