import {NgModule} from '@angular/core';

import {ObAutocompleteComponent} from './autocomplete.component';

export {ObAutocompleteComponent} from './autocomplete.component';
export {ObIAutocompleteInputOption, ObIAutocompleteInputOptionGroup, OptionLabelIconPosition} from './autocomplete.model';

@NgModule({
	imports: [ObAutocompleteComponent],
	exports: [ObAutocompleteComponent]
})
export class ObAutocompleteModule {}
