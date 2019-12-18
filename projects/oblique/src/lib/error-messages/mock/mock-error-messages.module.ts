import {NgModule} from '@angular/core';

import {MockMatErrorDirective} from './mock-mat-error.directive';
import {MockErrorMessagesComponent} from './mock-error-messages.component';
import {MockErrorMessagesDirective} from './mock-error-messages.directive';
import {MockErrorMessagesService} from './mock-error-messages.service';
import {ErrorMessagesService} from '../error-messages.module';

export {MockMatErrorDirective} from './mock-mat-error.directive';
export {MockErrorMessagesComponent} from './mock-error-messages.component';
export {MockErrorMessagesDirective} from './mock-error-messages.directive';
export {MockErrorMessagesService} from './mock-error-messages.service';

@NgModule({
	declarations: [
		MockErrorMessagesComponent,
		MockMatErrorDirective,
		MockErrorMessagesDirective
	],
	exports: [
		MockErrorMessagesComponent,
		MockMatErrorDirective,
		MockErrorMessagesDirective
	],
	providers: [{provide: ErrorMessagesService, useClass: MockErrorMessagesService}]
})
export class MockErrorMessagesModule {
}
