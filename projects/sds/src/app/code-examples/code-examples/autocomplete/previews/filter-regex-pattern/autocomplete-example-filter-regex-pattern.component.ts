import {ObAutocompleteModule, ObEIcon, ObIAutocompleteInputOption} from '@oblique/oblique';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
	standalone: true,
	imports: [ObAutocompleteModule, FormsModule],
	selector: 'app-autocomplete-example-default',
	templateUrl: './autocomplete-example-filter-regex-pattern.component.html'
})
export class AutocompleteExampleFilterRegexPatternComponent {
	selectedOption: ObIAutocompleteInputOption;
	pattern = '[textToFind]{3}';

	optionList: ObIAutocompleteInputOption[] = [
		{
			label: ' Graceling realm',
			disabled: false,
			iconName: ObEIcon.ADDRESS_BOOK
		},
		{
			label: ' Ice-cream',
			disabled: false,
			iconName: ObEIcon.ARCHIVE
		},
		{
			label: ' Blue',
			disabled: false,
			iconName: ObEIcon.BELL
		}
	];
	showSelection($event: ObIAutocompleteInputOption): void {
		this.selectedOption = $event;
	}
}
