import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';

import {DocumentMetaService} from './document-meta.service';
import { TelemetryService } from '../telemetry/telemetry.service';
import { requireAndRecordTelemetry } from '../telemetry/telemetry-require';

export {DocumentMetaService} from './document-meta.service';

@NgModule({
	imports: [CommonModule, TranslateModule],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}]
})
export class DocumentMetaModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, DocumentMetaModule);
	}
}
