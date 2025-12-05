import {ObAutocompleteModule, ObEIcon, type ObIAutocompleteInputOption} from '@oblique/oblique';
import {type AfterViewInit, ChangeDetectorRef, Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {JsonPipe} from '@angular/common';

@Component({
	selector: 'app-autocomplete-example-display-width',
	imports: [ObAutocompleteModule, ReactiveFormsModule, JsonPipe],
	templateUrl: './autocomplete-example-display-with.component.html',
})
export class AutocompleteExampleDisplayWithComponent implements AfterViewInit {
	selectedOption: ObIAutocompleteInputOption<{name: string}>;
	formControl = new FormControl('');
	optionList: ObIAutocompleteInputOption<{name: string}>[] = [
		{
			label: {name: 'Graceling realm'},
			disabled: false,
			iconName: ObEIcon.ADDRESS_BOOK,
		},
		{
			label: {name: 'Ice-cream'},
			disabled: false,
			iconName: ObEIcon.ARCHIVE_BOX,
		},
		{
			label: {name: 'Green'},
			disabled: false,
			iconName: ObEIcon.NOTIFICATION,
		},
	];

	showSelection($event: ObIAutocompleteInputOption<{name: string}>): void {
		this.selectedOption = $event;
	}

	displayFn(value: {name: string}): string {
		return value?.name ?? '';
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
