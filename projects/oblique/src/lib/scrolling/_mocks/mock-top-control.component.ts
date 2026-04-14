import {Component} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-top-control',
	template: '',
	exportAs: 'obTopControl',
})
export class ObMockTopControlComponent {
	public scrollTop(): void {}
}
