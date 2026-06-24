import {Component, input} from '@angular/core';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-spinner',
	template: '',
	exportAs: 'obSpinner',
})
export class ObMockSpinnerComponent {
	readonly channel = input('');
	readonly fixed = input(false);
	$state = 'out';
}
