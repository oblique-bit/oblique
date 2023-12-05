import {Injectable} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {jwtDecode} from 'jwt-decode';
import {ObIResourceAccessRoles, ObIResourceAccessToken} from './authentication.model';

@Injectable()
export class ObAuthenticationService {
	constructor(readonly oAuthService: OAuthService) {}

	performLogin(additionalState?: string, params?: any): void {
		this.oAuthService.initLoginFlow(additionalState, params);
	}

	performLogout(): void {
		this.oAuthService.logOut();
	}

	getIdentityClaims(): object {
		return this.oAuthService.getIdentityClaims();
	}

	getAllResourceAccessRoles(): ObIResourceAccessRoles[] {
		const rawRoles = jwtDecode<ObIResourceAccessToken>(this.oAuthService.getAccessToken()).resource_access;
		return Object.keys(rawRoles).map(key => ({name: key, roles: rawRoles[key].roles}));
	}
}
