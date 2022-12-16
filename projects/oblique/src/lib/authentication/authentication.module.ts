import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
	DateTimeProvider,
	DefaultHashHandler,
	DefaultOAuthInterceptor,
	HashHandler,
	MemoryStorage,
	NullValidationHandler,
	OAuthLogger,
	OAuthModule,
	OAuthModuleConfig,
	OAuthNoopResourceServerErrorHandler,
	OAuthResourceServerErrorHandler,
	OAuthService,
	OAuthStorage,
	SystemDateTimeProvider,
	UrlHelperService,
	ValidationHandler
} from 'angular-oauth2-oidc';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ObAuthenticationService} from './authentication.service';
import {ObAuthenticationConfigService} from './authentication-config.service';

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
	 * Adaptation of the forRoot method of the OAuthModule from the angular-oauth2-oidc library.
	 *
	 * These adaptations consist in the addition of Oblique's services in the providers.
	 *
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
			providers: [
				ObAuthenticationService,
				ObAuthenticationConfigService,
				OAuthService,
				UrlHelperService,
				{provide: OAuthLogger, useValue: console},
				{provide: OAuthStorage, useValue: typeof sessionStorage === 'undefined' ? new MemoryStorage() : sessionStorage},
				{provide: ValidationHandler, useClass: validationHandlerClass},
				{provide: HashHandler, useClass: DefaultHashHandler},
				{
					provide: OAuthResourceServerErrorHandler,
					useClass: OAuthNoopResourceServerErrorHandler
				},
				{provide: OAuthModuleConfig, useValue: config},
				{
					provide: HTTP_INTERCEPTORS,
					useClass: DefaultOAuthInterceptor,
					multi: true
				},
				{provide: DateTimeProvider, useClass: SystemDateTimeProvider}
			]
		};
	}
}
