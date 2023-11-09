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

@NgModule({
	imports: [ObMockErrorMessagesComponent, ObMockErrorMessagesDirective, ObMockMatErrorDirective],
	exports: [ObMockErrorMessagesComponent, ObMockErrorMessagesDirective, ObMockMatErrorDirective],
	providers: [{provide: ObErrorMessagesService, useClass: ObMockErrorMessagesService}]
})
export class ObMockErrorMessagesModule {}
