import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {ObAutocompleteTextToFindService} from '../autocomplete-text-to-find.service';

@Pipe({
	name: 'obHighlightTextPipe'
})
export class ObHighlightTextPipe implements PipeTransform {
	constructor(private readonly sanitizer: DomSanitizer, private readonly textToFindService: ObAutocompleteTextToFindService) {}

	transform(value: string, textToFind: string, cssClass = 'ob-highlight-text', pattern = 'textToFind', regexFlags = 'gi'): SafeHtml {
		if (!textToFind) {
			return value;
		}
		const toFind = this.textToFindService.escapeRegexCharacter(textToFind);
		const regex = this.textToFindService.createTextToFindRegex(pattern, regexFlags, toFind);
		// If there's no match, just return the original value.
		if (!regex.test(toFind)) {
			return value;
		}
		return this.sanitizer.bypassSecurityTrustHtml(this.highlightText(value, regex, cssClass));
	}

	private highlightText(value: string, regex: RegExp, cssClass: string): string {
		return value.replace(regex, matched => `<span class="${cssClass}">${matched}</span>`);
	}
}
