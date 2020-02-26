import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obUnsavedChanges]'
})
export class ObMockUnsavedChangesDirective {
	@Input() id;
}
