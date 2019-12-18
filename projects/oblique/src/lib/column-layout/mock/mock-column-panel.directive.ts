import {Directive} from '@angular/core';

@Directive({
	selector: '[orColumnPanel]',
	exportAs: 'orColumnPanel'
})
export class MockColumnPanelDirective {
	toggle(): void {
	}
}
