import {getScrollIntoViewDelta} from './scroll-delta';

describe('scroll-delta', () => {
	const container = document.createElement('div');
	const item = document.createElement('span');

	beforeEach(() => {
		container.appendChild(item);
	});

	describe(getScrollIntoViewDelta.name, () => {
		const mockComputedStyle = {paddingLeft: '10px', paddingRight: '10px'} as CSSStyleDeclaration;
		const mockContainerBoundingRect = {left: 100, right: 300} as DOMRect;
		test.each([
			{desc: 'item on the left', left: 50, right: 120, offset: -60},
			{desc: 'item on the right', left: 110, right: 350, offset: 60},
			{desc: 'visible item', left: 110, right: 250, offset: 0},
		])('with $desc', ({left, right, offset}) => {
			jest.spyOn(window, 'getComputedStyle').mockReturnValue(mockComputedStyle);
			jest.spyOn(container, 'getBoundingClientRect').mockReturnValue(mockContainerBoundingRect);
			jest.spyOn(item, 'getBoundingClientRect').mockReturnValue({left, right} as DOMRect);

			expect(getScrollIntoViewDelta(container, item)).toBe(offset);
		});
	});
});
