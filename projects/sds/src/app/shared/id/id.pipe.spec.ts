import {IdPipe} from './id.pipe';

describe(`${IdPipe.name}`, () => {
	describe(`${IdPipe.prototype.transform.name}`, () => {
		it.each<{idPrefix: string; idParts: (number | string)[]; expected: string}>([
			{idPrefix: '', idParts: [], expected: ''},
			{idPrefix: 'content', idParts: [''], expected: 'content--'},
			{idPrefix: 'content', idParts: [], expected: 'content'},
			{idPrefix: 'content', idParts: ['standard-contents', ''], expected: 'content--standard-contents-'},
			{idPrefix: 'content', idParts: ['standard-contents'], expected: 'content--standard-contents'},
			{idPrefix: 'content', idParts: ['component-documentation'], expected: 'content--component-documentation'},
			{idPrefix: 'content', idParts: ['standard-contents', 'heading', 1], expected: 'content--standard-contents-heading-1'},
			{
				idPrefix: 'content--standard-contents--button-links-1',
				idParts: ['button-link', 'button'],
				expected: 'content--standard-contents--button-links-1--button-link-button'
			}
		])('should transform idPrefix: $idPrefix & idParts into $expected', ({idPrefix, idParts, expected}) => {
			expect(new IdPipe().transform(idPrefix, idParts)).toEqual(expected);
		});
	});
});
