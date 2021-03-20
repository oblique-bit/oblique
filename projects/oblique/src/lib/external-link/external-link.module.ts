import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObExternalLinkDirective} from './external-link.directive';
import {obliqueProviders} from '../utilities';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';

export {ObExternalLinkDirective} from './external-link.directive';
export {EXTERNAL_LINK, ObEExternalLinkIcon, ObIExternalLink} from './external-link.model';

@NgModule({
	declarations: [ObExternalLinkDirective],
	imports: [CommonModule],
	providers: obliqueProviders(),
	exports: [ObExternalLinkDirective]
})
export class ObExternalLinkModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObExternalLinkModule);
	}
}
