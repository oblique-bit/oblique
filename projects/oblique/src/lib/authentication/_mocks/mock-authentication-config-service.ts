import {Injectable} from '@angular/core';
import {AuthConfig, ValidationHandler} from 'angular-oauth2-oidc';
import {Observable, of} from 'rxjs';

@Injectable()
export class ObMockAuthenticationConfigService {
	configureFlow(authFlowConfig: AuthConfig, tokenValidationHandler?: ValidationHandler): Observable<boolean> {
		return of(true);
	}
}
