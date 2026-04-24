import {ObAutocompleteModule, ObEIcon, type ObIAutocompleteInputOption} from '@oblique/oblique';
import {type AfterViewInit, ChangeDetectorRef, Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {JsonPipe} from '@angular/common';
import {MatHint} from '@angular/material/form-field';

@Component({
	selector: 'app-autocomplete-example-form',
	imports: [ObAutocompleteModule, ReactiveFormsModule, JsonPipe, MatHint],
	templateUrl: './autocomplete-example-form.component.html',
})
export class AutocompleteExampleFormComponent implements AfterViewInit {
	selectedOption: ObIAutocompleteInputOption;
	formGroup = new FormGroup({
		control: new FormControl('', Validators.required),
	});
	optionList: ObIAutocompleteInputOption[] = [
		{
			label: ' Graceling realm',
			disabled: false,
			iconName: ObEIcon.ADDRESS_BOOK,
		},
		{
			label: ' Ice-cream',
			disabled: false,
			iconName: ObEIcon.ARCHIVE_BOX,
		},
		{
			label: ' Blue',
			disabled: false,
			iconName: ObEIcon.NOTIFICATION,
		},
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
