import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obUnsavedChanges]',
	exportAs: 'obUnsavedChanges',
	standalone: true
})
export class ObMockUnsavedChangesDirective {
	@Input() id;
	@Input() isActive = true;
}
