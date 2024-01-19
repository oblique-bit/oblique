import {Directive, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obButton]',
	exportAs: 'obButton',
	standalone: true
})
export class ObMockButtonDirective {
	@Input() obButton = 'primary';
}
