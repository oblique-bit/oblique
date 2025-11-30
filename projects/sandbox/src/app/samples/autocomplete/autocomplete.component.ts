import {Component, type OnInit} from '@angular/core';
import type {
	ObIAutocompleteInputOption,
	ObIAutocompleteInputOptionGroup,
	OptionLabelIconPosition,
} from '@oblique/oblique';
import {FormControl} from '@angular/forms';

@Component({
	selector: 'sb-autocomplete-sample',
	standalone: false,
	templateUrl: './autocomplete.component.html',
	styleUrl: './autocomplete.component.scss',
})
export class AutocompleteSampleComponent implements OnInit {
	isDisabled = false;
	areDisabled = false;
	optionGroupList: ObIAutocompleteInputOptionGroup[];
	selectedOption: ObIAutocompleteInputOption;
	optionList: ObIAutocompleteInputOption[];
	listType: 'group' | 'onlyOptions' | 'empty' = 'onlyOptions';
	icons = [
		'address-book',
		'universal-access',
		'antique-building',
		'link_disconnect',
		'lock_open',
		'upload',
		'person',
		'person_brush',
		'person_checkmark',
		'person_code',
		'person_cog',
		'exclamation_triangle',
		'weight',
		'wheelchair',
		'wifi',
		'wrench',
	];
	randomWords = [
		'Unicorn',
		'Dragon',
		'Ice-cream',
		'Blue',
		'Five',
		'Graceling realm',
		'Baloo the bear',
		'Octopus',
		'Dr. Who',
	];
	optionIconPosition: OptionLabelIconPosition = 'end';
	searchText: string;
	visibleOptionList: ObIAutocompleteInputOption[] | ObIAutocompleteInputOptionGroup[];
	isFromControl = true;
	formControl = new FormControl('');
	formControlDisplayWith = new FormControl('');

	reactiveFormSnippet = `
// *.component.html
	<ob-autocomplete
		(selectedOptionChange)="showSelection($event)"
		[autocompleteOptions]="options"
		[optionIconPosition]="optionIconPosition"
		[formControl]="formControl"
		[filterRegexFlag]="'gi'"
		>
	</ob-autocomplete>

// *.component.ts
formControl = new FormControl('');
` as string;
	ngModelSnippet = `
	<ob-autocomplete
		(selectedOptionChange)="showSelection($event)"
		[(ngModel)]="searchText"
		[autocompleteOptions]="options"
		[optionIconPosition]="optionIconPosition"
		[filterRegexFlag]="'gi'"
		>
	</ob-autocomplete>` as string;
	pattern = 'textToFind';
	patternControl = new FormControl(this.pattern);
	replacedPattern: string;

	ngOnInit(): void {
		this.patternControl.valueChanges.subscribe(value => {
			this.replacedPattern = value;
			this.replacedPattern = this.replacedPattern.replace('textToFind', value);
			this.pattern = value;
		});
		this.optionList = this.createOptionList(10);
		this.optionGroupList = this.createOptionGroupList(10, this.areDisabled);
		this.updateVisibleOptionList();
	}

	reset(): void {
		this.formControl.reset();
	}

	createOptionGroupList(amount: number, disabled = false): ObIAutocompleteInputOptionGroup[] {
		const optionGroupList = [];
		for (let index = 0; index < amount; index++) {
			const groupLabel = `Group - ${index + 1}`;
			const groupOptions = this.createOptionList(Math.floor(Math.random() * 20) + 1, groupLabel, disabled);
			optionGroupList.push({
				groupLabel,
				disabled,
				groupOptions,
			});
		}
		return optionGroupList;
	}

	createOptionList(amount: number, groupName = '', disabled = false): ObIAutocompleteInputOption[] {
		const optionList = [];
		for (let index = 0; index < amount; index++) {
			optionList.push({
				label: `${groupName} ${this.randomWords[Math.floor(Math.random() * this.randomWords?.length - 1) + 1]}`,
				disabled,
				iconName: this.icons[Math.floor(Math.random() * this.icons?.length - 1) + 1],
			});
		}
		return optionList;
	}

	showSelection($event: ObIAutocompleteInputOption): void {
		this.selectedOption = $event;
	}

	updateVisibleOptionList(): void {
		if (this.listType === 'group') {
			this.visibleOptionList = this.optionGroupList;
			this.areDisabled = this.optionGroupList[0].groupOptions[0].disabled;
		} else if (this.listType === 'onlyOptions') {
			this.visibleOptionList = this.optionList;
			this.areDisabled = this.optionList[0].disabled;
		} else {
			this.visibleOptionList = [];
		}
	}

	disableOptions(disabled: boolean): void {
		this.visibleOptionList.map(optionList =>
			optionList?.groupOptions
				? // eslint-disable-next-line array-callback-return
					optionList?.groupOptions.map(option => {
						option.disabled = disabled;
					})
				: (optionList.disabled = disabled)
		);
	}

	toggleDisabledState(state: boolean): void {
		if (state) {
			this.formControl.disable();
		} else {
			this.formControl.enable();
		}
	}

	displayFn(option: string): string {
		return option ? `'*~-., ${option} ,.-~*'` : '';
	}
}
