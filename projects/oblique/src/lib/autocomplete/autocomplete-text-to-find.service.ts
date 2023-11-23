import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ObAutocompleteTextToFindService {
	escapeRegexCharacter(text: string): string {
		return text.replace(/[[\]{}()*+?.,\\^$|#-]/g, '\\$&');
	}

	createTextToFindRegex(regexFlags: string, textToFind: string): RegExp {
		return new RegExp(textToFind, regexFlags);
	}
}
