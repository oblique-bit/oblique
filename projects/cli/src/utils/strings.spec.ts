import {dasherize, decamelize} from './strings.js';

describe('decamelize', () => {
	test.each([
		['innerHTML', 'inner_html'],
		['applicationOperator', 'application_operator'],
		['foo2Bar', 'foo2_bar'],
		['css-class-name', 'css-class-name'],
		['my favorite items', 'my favorite items'],
	])('should decamelize %s into %s', (input, expected) => {
		expect(decamelize(input)).toEqual(expected);
	});
});

describe('dasherize', () => {
	test.each([
		['applicationOperator', 'application-operator'],
		['allowDirty', 'allow-dirty'],
		['httpInterceptors', 'http-interceptors'],
		['unknownRoute', 'unknown-route'],
		['externalLink', 'external-link'],
		['foo2Bar', 'foo2-bar'],
		['innerHTML', 'inner-html'],
		['action_name', 'action-name'],
		['css-class-name', 'css-class-name'],
		['my favorite items', 'my-favorite-items'],
		['ai-config', 'ai-config'],
		['title', 'title'],
		['no-banner', 'no-banner'],
	])('should dasherize %s into %s', (input, expected) => {
		expect(dasherize(input)).toEqual(expected);
	});
});
