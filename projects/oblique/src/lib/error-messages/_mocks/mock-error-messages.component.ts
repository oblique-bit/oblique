import {Component, Input} from '@angular/core';
import {NgControl} from '@angular/forms';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-error-messages',
	exportAs: 'obErrorMessages',
	template: '',
	standalone: true
})
export class ObMockErrorMessagesComponent {
	@Input() control: NgControl;
	errors: {key: string; params: Record<string, any>}[] = [];
}
