import {Injectable} from '@angular/core';
import {ObIResourceAccessRoles} from '../authentication.model';

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
