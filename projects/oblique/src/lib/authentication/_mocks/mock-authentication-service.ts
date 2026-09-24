import {Injectable} from '@angular/core';
import {ObIResourceAccessRoles} from '../authentication.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable()
export class ObMockAuthenticationService {
	performLogin(additionalState?: string, params?: any): void {}

	performLogout(): void {}

	getIdentityClaims(): object {
		return null;
	}

	getAllResourceAccessRoles(): ObIResourceAccessRoles[] {
		return [];
	}
}
