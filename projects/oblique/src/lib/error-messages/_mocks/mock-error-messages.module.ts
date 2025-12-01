import {NgModule} from '@angular/core';

import {ObMockMatErrorDirective} from './mock-mat-error.directive';
import {ObMockErrorMessagesComponent} from './mock-error-messages.component';
import {ObMockErrorMessagesDirective} from './mock-error-messages.directive';
import {ObMockErrorMessagesService} from './mock-error-messages.service';
import {ObErrorMessagesService} from '../error-messages.service';

export {ObMockMatErrorDirective} from './mock-mat-error.directive';
export {ObMockErrorMessagesComponent} from './mock-error-messages.component';
export {ObMockErrorMessagesDirective} from './mock-error-messages.directive';
export {ObMockErrorMessagesService} from './mock-error-messages.service';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockErrorMessagesComponent, ObMockErrorMessagesDirective, ObMockMatErrorDirective],
	providers: [{provide: ObErrorMessagesService, useClass: ObMockErrorMessagesService}],
	exports: [ObMockErrorMessagesComponent, ObMockErrorMessagesDirective, ObMockMatErrorDirective],
})
export class ObMockErrorMessagesModule {}
