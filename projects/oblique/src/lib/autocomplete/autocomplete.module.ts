import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {TranslateModule} from '@ngx-translate/core';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

import {ObAutocompleteComponent} from './autocomplete.component';
import {ObInputClearModule} from '../input-clear/input-clear.module';
import {ObOptionLabelIconModule} from './option-label-icon/option-label-icon.module';
import {ObHighlightTextModule} from './highlight-text/highlight-text.module';
import {obliqueProviders} from '../utilities';

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
export class ObAutocompleteModule {}
