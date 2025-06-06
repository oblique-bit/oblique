import {ObAutocompleteModule, ObEIcon, type ObIAutocompleteInputOption, type ObIAutocompleteInputOptionGroup} from '@oblique/oblique';
import {type AfterViewInit, ChangeDetectorRef, Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';

@Component({
	imports: [ObAutocompleteModule, ReactiveFormsModule, JsonPipe],
	selector: 'app-autocomplete-example-options-group',
	templateUrl: './autocomplete-example-options-group.component.html'
})
export class AutocompleteExampleIconOptionsGroupComponent implements AfterViewInit {
	selectedOption: ObIAutocompleteInputOption;
	formControl = new FormControl('');
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

	/* The following code is simply a workaround for https://github.com/angular/components/issues/26428. This is an Angular bug
	 * that prevents input prefix from being used in a Tab. */
	show = false; // eslint-disable-line @typescript-eslint/member-ordering
	private readonly cdf = inject(ChangeDetectorRef); // eslint-disable-line @typescript-eslint/member-ordering

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.show = true;
			this.cdf.markForCheck();
		}, 100);
	}
}
