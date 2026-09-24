import {Pipe, PipeTransform} from '@angular/core';
import {ObLoginState} from '../service-navigation.model';

@Pipe({
	name: 'obIsUserLoggedIn',
	standalone: false,
})
export class ObIsUserLoggedInPipe implements PipeTransform {
	transform(loginState: ObLoginState): boolean {
		return !!loginState?.includes('OK');
	}
}
