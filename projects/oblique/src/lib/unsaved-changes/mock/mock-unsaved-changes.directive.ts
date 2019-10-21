import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[orUnsavedChanges]'
})
export class MockUnsavedChangesDirective {
	@Input() id;
}
