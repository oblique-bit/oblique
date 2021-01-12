import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obUnsavedChanges]',
	exportAs: 'obUnsavedChanges'
})
export class ObMockUnsavedChangesDirective {
	@Input() id;
}
