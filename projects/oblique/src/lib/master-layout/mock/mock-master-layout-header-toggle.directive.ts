import {Directive} from '@angular/core';

@Directive({
	selector: '[obMasterLayoutHeaderToggle]',
	exportAs: 'obMasterLayoutHeaderToggle'
})
export class ObMockMasterLayoutHeaderToggleDirective {
	toggle($event): void {}
}
