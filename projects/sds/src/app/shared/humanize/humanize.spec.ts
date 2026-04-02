import {humanizeList} from './humanize';

describe('humanize', () => {
	test(humanizeList.name, () => {
		expect(humanizeList(['a', 'b', 'c'])).toBe('"a", "b" and "c"');
		expect(humanizeList(['a', 'b'])).toBe('"a" and "b"');
		expect(humanizeList(['a'])).toBe('"a"');
		expect(humanizeList([])).toBe('');
	});
});
