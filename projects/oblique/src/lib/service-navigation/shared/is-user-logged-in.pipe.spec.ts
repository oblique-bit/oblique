import {ObIsUserLoggedInPipe} from './is-user-logged-in.pipe';
import {ObLoginState} from '../service-navigation.model';

describe('IsUserLoggedInPipe', () => {
	const pipe = new ObIsUserLoggedInPipe();
	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		describe('With "SA" as loginState', () => {
			describe.each([true, false])('With "%s" as isGuestAllowed', isGuestAllowed => {
				it('should be false', () => {
					expect(pipe.transform('SA', isGuestAllowed)).toBe(false);
				});
			});
		});

		describe('With "S1" as loginState', () => {
			describe.each([true, false])('With "%s" as isGuestAllowed', isGuestAllowed => {
				it(`should be ${isGuestAllowed}`, () => {
					expect(pipe.transform('S1', isGuestAllowed)).toBe(isGuestAllowed);
				});
			});
		});

		describe.each(['S2OK', 'S2+OK', 'S3OK', 'S3+OK'])('With "%s" as loginState', loginState => {
			describe.each([true, false])('With "%s" as isGuestAllowed', isGuestAllowed => {
				it('should be true', () => {
					expect(pipe.transform(loginState as ObLoginState, isGuestAllowed)).toBe(true);
				});
			});
		});
	});
});
