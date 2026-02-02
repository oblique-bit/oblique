import {DomSanitizer} from '@angular/platform-browser';
import {Pipe, type PipeTransform, SecurityContext, inject} from '@angular/core';

/**
 * A pipe that makes bold part of a string
 */
@Pipe({
	name: 'markify',
})
export class MarkifyPipe implements PipeTransform {
	private readonly sanitizer = inject(DomSanitizer);

	transform(text: string, markText: string): any {
		const mark = (markText ?? '').trim();

		if (mark === '') {
			return text;
		}

		const markedText = this.markText(text, mark);

		return this.sanitizer.sanitize(SecurityContext.HTML, markedText);
	}

	private markText(text: string, mark: string): string {
		const textRegex = new RegExp(`(${mark.split(/[-_ ]/u).join('(_|-| )')})`, 'ui');

		let markedText = text;
		if (textRegex.test(text)) {
			markedText = text.replace(textRegex, '<mark>$1</mark>');
		} else {
			const valueTokens = text.split(/[-_ ]/u);
			const markTokens = mark.split(/[-_ ]/u);
			const matches = valueTokens.filter(valueToken => markTokens.includes(valueToken));
			if (matches.length > 0) {
				markedText = text.replace(new RegExp(`(${matches.join('|')})`, 'ugi'), '<mark>$1</mark>');
			}
		}

		return markedText;
	}
}
