import {ObLimitArraySizePipe} from './limit-array-size.pipe';

describe('ObLimitArraySizePipe', () => {
	const pipe = new ObLimitArraySizePipe();
	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		describe.each([
			{max: -1, result: 0},
			{max: 0, result: 0},
			{max: 1, result: 1},
			{max: 2, result: 2},
			{max: 3, result: 3},
			{max: 4, result: 3}
		])('with an array containing 3 elements and a max of $max elements', ({max, result}) => {
			it(`should return an array with ${result} elements`, () => {
				expect(pipe.transform([1, 2, 3], max).length).toBe(result);
			});
		});
	});
});
