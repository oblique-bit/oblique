import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgControl} from '@angular/forms';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-error-messages',
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	exportAs: 'obErrorMessages',
})
export class ObMockErrorMessagesComponent {
	@Input() control: NgControl;
	errors: {key: string; params: Record<string, any>}[] = [];
}
