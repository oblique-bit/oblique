import {Directive, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obUnsavedChanges]',
	exportAs: 'obUnsavedChanges',
	standalone: true
})
export class ObMockUnsavedChangesDirective {
	@Input() id;
	@Input() isActive = true;
}
