import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ObAutocompleteTextToFindService {
	escapeRegexCharacter(text: string): string {
		return text.replace(/[[\]{}()*+?.,\\^$|#]/g, '\\$&');
	}

	createTextToFindRegex(pattern: string, regexFlags: string, textToFind: string): RegExp {
		if (pattern.length <= 0) {
			throw Error("Property pattern should not be empty. Default value is 'textToFind'. That will replace with the value");
		}
		if (!pattern.includes('textToFind')) {
			throw Error("In customised regex patterns, the string 'textToFind' should mark the location where the entered text will be.");
		}
		return new RegExp(pattern.replace('textToFind', textToFind), regexFlags);
	}
}
