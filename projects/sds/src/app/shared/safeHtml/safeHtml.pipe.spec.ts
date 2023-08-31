import {TestBed} from '@angular/core/testing';
import {SafeHtmlPipe} from './safeHtml.pipe';
import {BrowserModule, SafeHtml} from '@angular/platform-browser';

describe(`${SafeHtmlPipe.name}`, () => {
	describe(`${SafeHtmlPipe.prototype.transform.name}`, () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [BrowserModule]
			});
		});

		it.each<{html: string; expected: SafeHtml}>([
			{html: ``, expected: {changingThisBreaksApplicationSecurity: ''}},
			{html: 'bla <strong> bla </strong>', expected: {changingThisBreaksApplicationSecurity: 'bla <strong> bla </strong>'}},
			{html: 'bla <script> bla </script>', expected: {changingThisBreaksApplicationSecurity: 'bla <script> bla </script>'}},
			{html: '<a href="#">foo</a>', expected: {changingThisBreaksApplicationSecurity: `<a href="#">foo</a>`}}
		])('should transform html: $html into safeHtml: $expected', ({html, expected}) => {
			TestBed.runInInjectionContext(() => {
				expect(new SafeHtmlPipe().transform(html)).toEqual(expected);
			});
		});
	});
});
