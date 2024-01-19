import {Injectable} from '@angular/core';
import {ObIResourceAccessRoles} from '../authentication.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
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
