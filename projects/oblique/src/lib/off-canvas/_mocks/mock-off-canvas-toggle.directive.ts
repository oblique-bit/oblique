import {Directive} from '@angular/core';

@Directive({
	selector: '[obOffCanvasToggle]',
	exportAs: 'obOffCanvasToggle',
	standalone: true
})
export class ObMockOffCanvasToggleDirective {
	toggle(): void {}
}
