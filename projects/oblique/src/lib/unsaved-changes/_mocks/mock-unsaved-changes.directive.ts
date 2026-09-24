import {Directive, input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obUnsavedChanges]',
	exportAs: 'obUnsavedChanges',
})
export class ObMockUnsavedChangesDirective {
	readonly id = input.required<string>();
	readonly isActive = input(true);
}
