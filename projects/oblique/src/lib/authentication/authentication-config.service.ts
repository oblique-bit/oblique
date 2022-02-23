import {Injectable} from '@angular/core';
import {AuthConfig, OAuthService, ValidationHandler} from 'angular-oauth2-oidc';
import {Observable, from} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class ObAuthenticationConfigService {
	useDiscoveryDocument = true;
	setupAutomaticSilentRefresh = false;

	constructor(private readonly oAuthService: OAuthService) {}

	configureFlow(authFlowConfig: AuthConfig, tokenValidationHandler?: ValidationHandler): Observable<boolean> {
		this.oAuthService.configure(authFlowConfig);
		this.oAuthService.tokenValidationHandler = tokenValidationHandler;

		const configurationResult: Observable<boolean> = this.useDiscoveryDocument
			? from(this.oAuthService.loadDiscoveryDocumentAndTryLogin())
			: from(this.oAuthService.tryLogin());

		return configurationResult.pipe(tap(() => this.setupAutomaticSilentRefreshIfConfigured()));
	}

	private setupAutomaticSilentRefreshIfConfigured(): void {
		if (this.setupAutomaticSilentRefresh) {
			this.oAuthService.setupAutomaticSilentRefresh();
		}
	}
}
