import {Injectable} from '@angular/core';
import {NgControl} from '@angular/forms';

@Injectable()
export class ErrorMessagesService {
	createMessages(control: NgControl): {key: string, params: {[param: string]: any}}[] {
		return Object.keys(control.errors).map((key) => {
			return {
				key: `i18n.validation.${key}`,
				params: control.errors[key].params
			};
		});
	}
}
