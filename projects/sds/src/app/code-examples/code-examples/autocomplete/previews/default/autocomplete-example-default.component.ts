import {ObAutocompleteModule, ObEIcon, type ObIAutocompleteInputOption} from '@oblique/oblique';
import {type AfterViewInit, ChangeDetectorRef, Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';

@Component({
	imports: [ObAutocompleteModule, ReactiveFormsModule, JsonPipe],
	selector: 'app-autocomplete-example-default',
	templateUrl: './autocomplete-example-default.component.html'
})
export class AutocompleteExampleDefaultComponent implements AfterViewInit {
	selectedOption: ObIAutocompleteInputOption;
	formControl = new FormControl('');
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
