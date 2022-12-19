import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {NullValidationHandler, OAuthModule, OAuthModuleConfig, provideOAuthClient} from 'angular-oauth2-oidc';
import {ObAuthenticationConfigService} from './authentication-config.service';
import {ObAuthenticationService} from './authentication.service';
export {ObAuthenticationConfigService} from './authentication-config.service';
export {ObAuthenticationService} from './authentication.service';
export {ObIResourceAccessRoles} from './authentication.model';

@NgModule({
	imports: [CommonModule, OAuthModule]
})
export class ObAuthenticationModule {
	constructor(@Optional() @SkipSelf() parentModule?: ObAuthenticationModule) {
		if (parentModule) {
			throw new Error("ObAuthenticationModule is already loaded. Import it in the application's root module only");
		}
	}

	/**
	 * @remarks
	 * The default validationHandlerClass "NullValidationHandler" does nothing. Another ValidationHandler should be provided by the user.
	 *
	 * @param config the OAuthModuleConfig given by the user. Default is null.
	 * @param validationHandlerClass the ValidationHandler given by the user. Default is NullValidationHandler wich does nothing.
	 */
	static forRoot(
		config: OAuthModuleConfig = null,
		validationHandlerClass = NullValidationHandler
	): ModuleWithProviders<ObAuthenticationModule> {
		return {
			ngModule: ObAuthenticationModule,
			providers: [ObAuthenticationService, ObAuthenticationConfigService, provideOAuthClient(config, validationHandlerClass)]
		};
	}
}
