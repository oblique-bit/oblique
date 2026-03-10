import {ObAutocompleteModule, ObEIcon, type ObIAutocompleteInputOption} from '@oblique/oblique';
import {type AfterViewInit, ChangeDetectorRef, Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';

@Component({
	selector: 'app-autocomplete-example-aria-label',
	imports: [ObAutocompleteModule, ReactiveFormsModule, JsonPipe],
	templateUrl: './autocomplete-example-aria-label.component.html',
})
export class AutocompleteExampleAriaLabelComponent implements AfterViewInit {
	selectedOption: ObIAutocompleteInputOption;
	formControl = new FormControl('');
	optionList: ObIAutocompleteInputOption[] = [
		{
			label: ' Graceling realm',
			disabled: false,
			iconName: ObEIcon.ADDRESS_BOOK,
			ariaLabel: 'Graceling realm aria-label', // aria-Label has a value
		},
		{
			label: ' Ice-cream',
			disabled: false,
			iconName: ObEIcon.ARCHIVE_BOX,
			ariaLabel: '',
		},
		{
			label: ' Blue',
			disabled: false,
			iconName: ObEIcon.NOTIFICATION, // ariaLabel is not used
		},
	];
	// see result of the aria-Label using the dev-tools
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
