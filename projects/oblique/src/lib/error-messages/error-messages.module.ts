import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {ObMatErrorDirective} from './mat-error.directive';
import {ObErrorMessagesDirective} from './error-messages.directive';
import {ObTranslateParamsModule} from '../translate-params/translate-params.module';
import {ObFormControlStateModule} from '../form-control-state/form-control-state.module';
import {ObErrorMessagesComponent} from './error-messages.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObErrorMessagesComponent} from './error-messages.component';
export {ObErrorMessagesService} from './error-messages.service';
export {ObMatErrorDirective} from './mat-error.directive';
export {ObErrorMessagesDirective} from './error-messages.directive';

@NgModule({
	imports: [CommonModule, FormsModule, TranslateModule, ObFormControlStateModule, ObTranslateParamsModule],
	declarations: [ObErrorMessagesComponent, ObMatErrorDirective, ObErrorMessagesDirective],
	providers: obliqueProviders(),
	exports: [ObErrorMessagesComponent, ObMatErrorDirective, ObErrorMessagesDirective]
})
export class ObErrorMessagesModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObErrorMessagesModule);
	}
}
