import {ObAcceptAllPipe} from './accept-all.pipe';

describe('ObAcceptAllPipe', () => {
	let pipe = new ObAcceptAllPipe();

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		it('should return true if the array is null', () => {
			expect(pipe.transform(null)).toBe(true);
		});

		it('should return true if the array is undefined', () => {
			expect(pipe.transform(undefined)).toBe(true);
		});

		it('should return true if the array is empty', () => {
			expect(pipe.transform([])).toBe(true);
		});

		it('should return true if the array contains "*"', () => {
			expect(pipe.transform(['test', '*'])).toBe(true);
		});

		it('should return false if the array does not contains "*"', () => {
			expect(pipe.transform(['test'])).toBe(false);
		});
	});
});
