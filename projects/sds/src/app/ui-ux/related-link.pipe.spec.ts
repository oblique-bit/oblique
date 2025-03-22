import {RelatedLinkPipe} from './related-link.pipe';

describe(RelatedLinkPipe.name, () => {
	const pipe = new RelatedLinkPipe();
	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform method', () => {
		it('returns the param if no slash is present', () => {
			expect(pipe.transform('path')).toBe('path');
		});

		it('return the last part of a path', () => {
			expect(pipe.transform('path/to/somewhere')).toBe('somewhere');
		});

		it('return the last part of a path that ends with a slash', () => {
			expect(pipe.transform('path/to/somewhere/')).toBe('somewhere');
		});
	});
});
