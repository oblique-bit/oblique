import {Directive} from '@angular/core';

@Directive({
	selector: '[obOffCanvasToggle]',
	exportAs: 'obOffCanvasToggle'
})
export class ObMockOffCanvasToggleDirective {
	toggle(): void {}
}
