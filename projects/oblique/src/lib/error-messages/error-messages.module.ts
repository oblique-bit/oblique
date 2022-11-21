import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {ObMatErrorDirective} from './mat-error.directive';
import {ObErrorMessagesDirective} from './error-messages.directive';
import {ObTranslateParamsModule} from '../translate-params/translate-params.module';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObErrorMessagesService} from './error-messages.service';
export {ObMatErrorDirective} from './mat-error.directive';
export {ObErrorMessagesDirective} from './error-messages.directive';

@NgModule({
	imports: [CommonModule, FormsModule, ObTranslateParamsModule, TranslateModule],
	declarations: [ObErrorMessagesDirective, ObMatErrorDirective],
	providers: obliqueProviders(),
	exports: [ObErrorMessagesDirective, ObMatErrorDirective]
})
export class ObErrorMessagesModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObErrorMessagesModule);
	}
}
