import {ChangeDetectionStrategy, Component, output} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-top-control',
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	exportAs: 'obTopControl',
})
export class ObMockTopControlComponent {
	readonly scrollToTop = output();
	public scrollTop(): void {}
}
