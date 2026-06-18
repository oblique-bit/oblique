import {Injectable} from '@angular/core';
import {AuthConfig, ValidationHandler} from 'angular-oauth2-oidc';
import {Observable, of} from 'rxjs';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable()
export class ObMockAuthenticationConfigService {
	configureFlow(authFlowConfig: AuthConfig, tokenValidationHandler?: ValidationHandler): Observable<boolean> {
		return of(true);
	}
}
