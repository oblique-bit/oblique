import {Injectable} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {jwtDecode} from 'jwt-decode';
import {ObIResourceAccessRoles, ObIResourceAccessToken} from './authentication.model';

@Injectable()
export class ObAuthenticationService {
	constructor(readonly oAuthService: OAuthService) {}

	performLogin(additionalState?: string, params?: object): void {
		this.oAuthService.initLoginFlow(additionalState, params);
	}

	performLogout(): void {
		this.oAuthService.logOut();
	}

	/**
	 *  @deprecated since Oblique 13. Please use an API endpoint to get the user roles (or any data stored in the token),
	 *  see https://www.rfc-editor.org/rfc/rfc9068.html#name-privacy-considerations for more details.
	 */
	getIdentityClaims(): object {
		return this.oAuthService.getIdentityClaims();
	}

	/**
	 *  @deprecated since Oblique 13. Please use an API endpoint to get the user roles (or any data stored in the token),
	 *  see https://www.rfc-editor.org/rfc/rfc9068.html#name-privacy-considerations for more details.
	 */
	getAllResourceAccessRoles(): ObIResourceAccessRoles[] {
		const rawRoles = jwtDecode<ObIResourceAccessToken>(this.oAuthService.getAccessToken()).resource_access;
		return Object.keys(rawRoles).map(key => ({name: key, roles: rawRoles[key].roles}));
	}
}
