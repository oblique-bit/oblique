import {Directive, Input} from '@angular/core';

@Directive({
	selector: '[obUnsavedChangesTabs]'
})
export class ObMockUnsavedChangesTabsDirective {
	@Input() id;
}
