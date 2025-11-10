import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Pipe({
	name: 'obHighlightTextPipe',
	standalone: true,
})
export class ObMockHighlightTextPipe implements PipeTransform {
	constructor(private readonly sanitizer: DomSanitizer) {}

	transform(
		value: string,
		textToFind: string,
		cssClass = 'ob-searched-text',
		pattern = 'textToFind',
		regexFlags = 'gi'
	): SafeHtml {
		return value;
	}
}
