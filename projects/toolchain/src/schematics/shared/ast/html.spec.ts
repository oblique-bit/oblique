import {findElement, getAttribute, setAttribute, transformDocument, transformFragment} from './html';
import {parse} from 'parse5';

describe('ast', () => {
	describe(transformDocument, () => {
		test('empty transformer', () => {
			const html = transformDocument('<span id="first"/>', () => {});
			expect(html).toBe('<html><head></head><body><span id="first"></span></body></html>');
		});

		test('transformer', () => {
			const html = transformDocument('<span id="first"/>', document => {
				const span = findElement(document, element => element.tagName === 'span');
				setAttribute(span, 'tabindex', '1');
			});
			expect(html).toBe('<html><head></head><body><span id="first" tabindex="1"></span></body></html>');
		});
	});

	describe(transformFragment, () => {
		test('empty transform', () => {
			const html = transformFragment('<span id="first"/>', () => {});
			expect(html).toBe('<span id="first"></span>');
		});

		test('transformer', () => {
			const html = transformFragment('<span id="first"/>', document => {
				const span = findElement(document, element => element.tagName === 'span');
				setAttribute(span, 'tabindex', '1');
			});
			expect(html).toBe('<span id="first" tabindex="1"></span>');
		});
	});

	describe(findElement.name, () => {
		test.each([
			{desc: 'with tag', matcher: 'span'},
			{desc: 'with matcher function', matcher: element => element.tagName === 'span'},
		])('flat context $desc', ({matcher}) => {
			const document = parse(`<span id="first"/><span id="second"/>`);
			const span = findElement(document, matcher);

			expect(span.attrs[0].value).toBe('first');
		});

		test.each([
			{desc: 'with tag', matcher: 'span'},
			{desc: 'with matcher function', matcher: element => element.tagName === 'span'},
		])('nested context $desc', ({matcher}) => {
			const document = parse(`<div><div><div><span id="first"/><span id="second"/></div></div></div>`);
			const span = findElement(document, matcher);

			expect(span.attrs[0].value).toBe('first');
		});

		test('text node', () => {
			const document = parse(`hello`);

			expect(findElement(document, 'div')).toBeUndefined();
		});

		test.each([
			{desc: 'with tag', matcher: 'link'},
			{desc: 'with matcher function', matcher: element => element.tagName === 'link'},
		])('no matching element $desc', ({matcher}) => {
			const document = parse(`<div><div><div><span id="first"/><span id="second"/></div></div></div>`);
			const el = findElement(document, matcher);

			expect(el).toBeUndefined();
		});

		test('no document', () => {
			const el = findElement(undefined, () => true);

			expect(el).toBeUndefined();
		});
	});

	describe(getAttribute.name, () => {
		test('matching element', () => {
			const document = parse(`<span id="first" tabindex="1"/>`);
			const span = findElement(document, element => element.tagName === 'span');

			expect(getAttribute(span, 'id')).toBe('first');
		});

		test('no matching attribute', () => {
			const document = parse(`<span id="first"/>`);
			const el = findElement(document, element => element.tagName === 'span');

			expect(getAttribute(el, 'tabindex')).toBeUndefined();
		});
	});

	describe(setAttribute.name, () => {
		test.each([
			{desc: 'with self-closing tag', template: `<span id="first"/>`},
			{desc: 'without self-closing tag', template: `<span id="first">hello</span>`},
		])('update attribute $desc', ({template}) => {
			const document = parse(template);
			const span = findElement(document, element => element.tagName === 'span');

			setAttribute(span, 'id', 'second');

			expect(span.attrs.length).toBe(1);
			expect(getAttribute(span, 'id')).toBe('second');
		});

		test.each([
			{desc: 'with self-closing tag', template: `<span id="first"/>`},
			{desc: 'without self-closing tag', template: `<span id="first">hello</span>`},
		])('insert attribute with $desc', ({template}) => {
			const document = parse(template);
			const span = findElement(document, element => element.tagName === 'span');

			setAttribute(span, 'tabindex', '1');

			expect(span.attrs.length).toBe(2);
			expect(getAttribute(span, 'id')).toBe('first');
			expect(getAttribute(span, 'tabindex')).toBe('1');
		});
	});
});
