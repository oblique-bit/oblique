import {NgModule} from '@angular/core';

import {obliqueProviders} from '../utilities';
import {ObAutocompleteComponent} from './autocomplete.component';

export {ObAutocompleteComponent} from './autocomplete.component';
export {ObIAutocompleteInputOption, ObIAutocompleteInputOptionGroup, OptionLabelIconPosition} from './autocomplete.model';

@NgModule({
	imports: [ObAutocompleteComponent],
	exports: [ObAutocompleteComponent],
	providers: obliqueProviders()
})
export class ObAutocompleteModule {}
