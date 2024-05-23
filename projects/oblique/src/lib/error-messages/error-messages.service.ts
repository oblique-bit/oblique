import {Injectable} from '@angular/core';
import {NgControl} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class ObErrorMessagesService {
	createMessages(control: NgControl): {key: string; params: Record<string, unknown>}[] {
		return Object.keys(control.errors).map(key => {
			const subkeys = Object.keys(control.errors[key]);
			// If the subproperty is an object, it has to be the error
			if (subkeys.length === 1 && typeof control.errors[key][subkeys[0]] === 'object') {
				return {
					key: `i18n.validation.${key}.${subkeys[0]}`,
					params: control.errors[key][subkeys[0]]
				};
			}
			return {
				key: `i18n.validation.${key}`,
				params: control.errors[key]
			};
		});
	}
}
