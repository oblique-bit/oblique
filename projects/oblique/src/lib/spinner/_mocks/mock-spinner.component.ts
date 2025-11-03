import {Component, Input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-spinner',
	standalone: true,
	template: '',
	exportAs: 'obSpinner'
})
export class ObMockSpinnerComponent {
	@Input() channel = '';
	@Input() fixed = false;
	$state = 'out';
}
