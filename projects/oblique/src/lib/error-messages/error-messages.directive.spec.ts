import {ObErrorMessagesDirective} from './error-messages.directive';
import {NgForm} from '@angular/forms';

describe('ErrorMessagesDirective', () => {
	it('should create an instance', () => {
		const directive = new ObErrorMessagesDirective({} as NgForm, null);
		expect(directive).toBeTruthy();
	});
});
