import {Injectable, inject} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';

@Injectable()
export class ObAuthenticationService {
	readonly oAuthService = inject(OAuthService);

	performLogin(additionalState?: string, params?: object): void {
		this.oAuthService.initLoginFlow(additionalState, params);
	}

	performLogout(): void {
		this.oAuthService.logOut();
	}
}
