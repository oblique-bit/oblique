import {Directive, input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obButton]',
	exportAs: 'obButton',
})
export class ObMockButtonDirective {
	readonly obButton = input('primary');
}
