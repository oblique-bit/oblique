import {Component, Input} from '@angular/core';
import {NgControl} from '@angular/forms';

@Component({
	selector: 'or-error-messages',
	exportAs: 'orErrorMessages',
	template: ''
})
export class MockErrorMessagesComponent {
	@Input() control: NgControl;
	errors: { key: string, params: { [param: string]: any } }[] = [];
}
