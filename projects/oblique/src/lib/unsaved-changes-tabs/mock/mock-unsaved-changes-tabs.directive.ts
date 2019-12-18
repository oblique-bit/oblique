import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[orUnsavedChangesTabs]'
})
export class MockUnsavedChangesTabsDirective {
	@Input() id;
}
