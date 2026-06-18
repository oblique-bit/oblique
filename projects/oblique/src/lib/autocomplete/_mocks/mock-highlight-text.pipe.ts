import {Pipe, PipeTransform, inject} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Pipe({
	name: 'obHighlightTextPipe',
})
export class ObMockHighlightTextPipe implements PipeTransform {
	private readonly sanitizer = inject(DomSanitizer);

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
