import {Pipe, PipeTransform} from '@angular/core';
import {ObLoginState} from '../service-navigation.model';

@Pipe({
	name: 'obIsUserLoggedIn'
})
export class ObIsUserLoggedInPipe implements PipeTransform {
	transform(loginState: ObLoginState, isGuestAllowed: boolean): boolean {
		if (loginState === 'S1') {
			return isGuestAllowed;
		}
		return loginState.includes('OK');
	}
}
