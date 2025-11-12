import {Directive, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obButton]',
	standalone: true,
	exportAs: 'obButton',
})
export class ObMockButtonDirective {
	@Input() obButton = 'primary';
}
