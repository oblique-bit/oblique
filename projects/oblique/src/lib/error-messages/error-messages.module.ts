import {NgModule} from '@angular/core';

import {ObMatErrorDirective} from './mat-error.directive';
import {ObErrorMessagesDirective} from './error-messages.directive';
import {ObTranslateParamsPipe} from '../translate-params/translate-params.pipe';

export {ObErrorMessagesService} from './error-messages.service';
export {ObMatErrorDirective} from './mat-error.directive';
export {ObErrorMessagesDirective} from './error-messages.directive';

@NgModule({
	imports: [ObErrorMessagesDirective, ObMatErrorDirective, ObTranslateParamsPipe],
	exports: [ObErrorMessagesDirective, ObMatErrorDirective, ObTranslateParamsPipe]
})
export class ObErrorMessagesModule {}
