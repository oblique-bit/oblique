import {ObAutocompleteModule, ObEIcon, ObIAutocompleteInputOption, ObIAutocompleteInputOptionGroup} from '@oblique/oblique';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
	standalone: true,
	imports: [ObAutocompleteModule, FormsModule],
	selector: 'app-autocomplete-example-options-group',
	templateUrl: './autocomplete-example-options-group.component.html'
})
export class AutocompleteExampleIconOptionsGroupComponent {
	selectedOption: ObIAutocompleteInputOption;

	optionList: ObIAutocompleteInputOptionGroup[] = [
		{
			groupLabel: 'Group - 1',
			disabled: false,
			groupOptions: [
				{
					label: 'Group - 1 Graceling realm',
					disabled: false,
					iconName: ObEIcon.ADDRESS_BOOK
				},
				{
					label: 'Group - 1 Dr. Who',
					disabled: false,
					iconName: ObEIcon.ARCHIVE
				},
				{
					label: 'Group - 1 Octopus',
					disabled: false,
					iconName: ObEIcon.BELL
				}
			]
		},
		{
			groupLabel: 'Group - 2',
			disabled: false,
			groupOptions: [
				{
					label: 'Group - 2 Graceling realm',
					disabled: false,
					iconName: ObEIcon.WRENCH
				},
				{
					label: 'Group - 2 Octopus',
					disabled: false,
					iconName: ObEIcon.WHEELCHAIR
				},
				{
					label: 'Group - 2 Five',
					disabled: false,
					iconName: ObEIcon.WARNING_TRIANGLE
				}
			]
		},
		{
			groupLabel: 'Group - 3',
			disabled: false,
			groupOptions: [
				{
					label: 'Group - 3 Five',
					disabled: false,
					iconName: ObEIcon.ENVELOPE
				},
				{
					label: 'Group - 3 Ice-cream',
					disabled: false,
					iconName: ObEIcon.EYEDROPPER
				},
				{
					label: 'Group - 3 Octopus',
					disabled: false,
					iconName: ObEIcon.SHOPPING_CART
				}
			]
		}
	];
	showSelection($event: ObIAutocompleteInputOption): void {
		this.selectedOption = $event;
	}
}
