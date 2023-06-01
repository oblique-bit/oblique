import {ObINavigationLink} from '../master-layout.model';
import {ObNavigationLink} from './navigation-link.model';

describe(`${ObNavigationLink.name}`, () => {
	describe('constructor', () => {
		test.each<{expected: string; label: string; url: string}>([
			{expected: 'i18n-url-and-ending', label: '', url: 'i18n.url.and-----ENDING_____'},
			{expected: 'label-url', label: 'LABEL', url: 'url-----'},
			{expected: 'this-is-aaaaaaalabel-with-a-url', label: 'this___is....äääääääLabel', url: 'with()()()())(a|%+%&%&+URL'},
			{expected: 'beginning-test', label: '_____beginning', url: '////test'}
		])('that it have $expected as id, when given a label of: $label & an url of: $url', ({expected, label, url}) => {
			const testObINavigationLink: ObNavigationLink = new ObNavigationLink({label, url});
			expect(testObINavigationLink.id).toBe(expected);
		});
	});

	describe('constructor', () => {
		test.each<{expected: string; link: ObINavigationLink}>([
			{expected: '', link: {label: '', url: ''}},
			{expected: 'label-url', link: {label: 'label', url: 'url'}},
			{expected: 'someOtherI-d', link: {id: 'someOtherI-d', label: 'label', url: 'url'}}
		])(
			'that link has id of $expected, when given a label of: $link.label, an url of: $link.url & an id of: $link.id',
			({expected, link}) => {
				expect(new ObNavigationLink(link).id).toBe(expected);
			}
		);
	});
});
