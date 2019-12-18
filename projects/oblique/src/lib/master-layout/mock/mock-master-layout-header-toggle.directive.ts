import {Directive} from '@angular/core';

@Directive({
	selector: '[orMasterLayoutHeaderToggle]',
	exportAs: 'orMasterLayoutHeaderToggle'
})
export class MockMasterLayoutHeaderToggleDirective {
	toggle($event): void {
	}
}
