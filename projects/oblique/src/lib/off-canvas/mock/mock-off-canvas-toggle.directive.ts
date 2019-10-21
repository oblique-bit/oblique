import {Directive} from '@angular/core';

@Directive({
	selector: '[orOffCanvasToggle]',
	exportAs: 'orOffCanvasToggle'
})
export class MockOffCanvasToggleDirective {
	toggle(): void {
	}
}
