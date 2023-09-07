import {Component, Input} from '@angular/core';
import {NgControl} from '@angular/forms';

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
