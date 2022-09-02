import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

import {ObAutocompleteComponent} from './autocomplete.component';
import {ObInputClearModule} from '../input-clear/input-clear.module';
import {ObOptionLabelIconModule} from './option-label-icon/option-label-icon.module';
import {ObHighlightTextModule} from './highlight-text/highlight-text.module';
import {obliqueProviders} from '../utilities';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObTelemetryService} from '../telemetry/telemetry.service';

export {ObAutocompleteComponent} from './autocomplete.component';
export {ObIAutocompleteInputOption, ObIAutocompleteInputOptionGroup, OptionLabelIconPosition} from './autocomplete.model';

@NgModule({
	declarations: [ObAutocompleteComponent],
	imports: [
		CommonModule,
		FormsModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		ObHighlightTextModule,
		ObInputClearModule,
		ObOptionLabelIconModule,
		ReactiveFormsModule,
		TranslateModule
	],
	exports: [ObAutocompleteComponent],
	providers: obliqueProviders()
})
export class ObAutocompleteModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObAutocompleteModule);
	}
}
