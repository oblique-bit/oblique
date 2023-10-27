import {ObAutocompleteModule, ObEIcon, ObIAutocompleteInputOption} from '@oblique/oblique';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
	standalone: true,
	imports: [ObAutocompleteModule, FormsModule],
	selector: 'app-autocomplete-example-icon-position-start',
	templateUrl: './autocomplete-example-icon-position-start.component.html'
})
export class AutocompleteExampleIconPositionStartComponent {
	selectedOption: ObIAutocompleteInputOption;

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
