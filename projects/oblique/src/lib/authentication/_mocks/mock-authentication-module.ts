import {NgModule} from '@angular/core';
import {ObAuthenticationService} from '../authentication.service';
import {ObAuthenticationConfigService} from '../authentication-config.service';
import {ObMockAuthenticationConfigService} from './mock-authentication-config-service';
import {ObMockAuthenticationService} from './mock-authentication-service';

export {ObMockAuthenticationConfigService} from './mock-authentication-config-service';
export {ObMockAuthenticationService} from './mock-authentication-service';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	providers: [
		{provide: ObAuthenticationConfigService, useClass: ObMockAuthenticationConfigService},
		{provide: ObAuthenticationService, useClass: ObMockAuthenticationService}
	]
})
export class ObMockAuthenticationModule {}
