import {ObIsUserLoggedInPipe} from './is-user-logged-in.pipe';
import {ObLoginState} from '../service-navigation.model';

describe('IsUserLoggedInPipe', () => {
	const pipe = new ObIsUserLoggedInPipe();
	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		describe.each(['SA', 'S1'])('With "%s" as loginState', loginState => {
			it('should be false', () => {
				expect(pipe.transform(loginState as ObLoginState)).toBe(false);
			});
		});

		describe.each(['S2OK', 'S2+OK', 'S3OK', 'S3+OK'])('With "%s" as loginState', loginState => {
			it('should be true', () => {
				expect(pipe.transform(loginState as ObLoginState)).toBe(true);
			});
		});
	});
});
