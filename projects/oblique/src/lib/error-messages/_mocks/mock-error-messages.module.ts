import {NgModule} from '@angular/core';

import {ObMockMatErrorDirective} from './mock-mat-error.directive';
import {ObMockErrorMessagesDirective} from './mock-error-messages.directive';
import {ObMockErrorMessagesService} from './mock-error-messages.service';

export {ObMockMatErrorDirective} from './mock-mat-error.directive';
export {ObMockErrorMessagesDirective} from './mock-error-messages.directive';
export {ObMockErrorMessagesService} from './mock-error-messages.service';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockErrorMessagesDirective, ObMockMatErrorDirective],
	providers: [ObMockErrorMessagesService],
	exports: [ObMockErrorMessagesDirective, ObMockMatErrorDirective],
})
export class ObMockErrorMessagesModule {}
