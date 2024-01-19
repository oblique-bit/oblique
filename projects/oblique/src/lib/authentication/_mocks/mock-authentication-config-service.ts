import {Injectable} from '@angular/core';
import {AuthConfig, ValidationHandler} from 'angular-oauth2-oidc';
import {Observable, of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockAuthenticationConfigService {
	configureFlow(authFlowConfig: AuthConfig, tokenValidationHandler?: ValidationHandler): Observable<boolean> {
		return of(true);
	}
}
