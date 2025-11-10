import {BrowserModule} from '@angular/platform-browser';
import {TestBed} from '@angular/core/testing';
import {MarkifyPipe} from './markify.pipe';

describe(MarkifyPipe.name, () => {
	describe(MarkifyPipe.prototype.transform.name, () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [BrowserModule]
			});
		});

		it.each<{text: string; bold: string; expected: string}>([
			{text: 'home', bold: '', expected: 'home'},
			{text: 'home', bold: 'h', expected: '<mark>h</mark>ome'},
			{text: 'home', bold: 'ho', expected: '<mark>ho</mark>me'},
			{text: 'home', bold: 'hom', expected: '<mark>hom</mark>e'},
			{text: 'home', bold: 'home', expected: '<mark>home</mark>'}
		])('should transform text: $text into $expected', ({text, bold, expected}) => {
			TestBed.runInInjectionContext(() => {
				expect(new MarkifyPipe().transform(text, bold)).toEqual(expected);
			});
		});
	});
});
