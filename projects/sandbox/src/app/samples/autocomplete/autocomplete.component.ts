import {Component, OnInit} from '@angular/core';
import {ObIAutocompleteInputOption, ObIAutocompleteInputOptionGroup, OptionLabelIconPosition} from '@oblique/oblique';
import {FormControl} from '@angular/forms';

@Component({
	selector: 'sb-autocomplete-sample',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteSampleComponent implements OnInit {
	isDisabled = false;
	areDisabled = false;
	optionGroupList: ObIAutocompleteInputOptionGroup[];
	selectedOption: ObIAutocompleteInputOption;
	optionList: ObIAutocompleteInputOption[];
	listType: 'group' | 'onlyOptions' | 'empty' = 'onlyOptions';
	icons: string[];
	randomWords: string[];
	optionIconPosition: OptionLabelIconPosition = 'end';
	searchText: string;
	visibleOptionList: ObIAutocompleteInputOption[] | ObIAutocompleteInputOptionGroup[];
	isFromControl = true;
	formControl = new FormControl('');

	reactiveFormSnippet = `
// *.component.html
	<ob-autocomplete
		(selectedOptionChange)="showSelection($event)"
		[autocompleteOptions]="options"
		[optionIconPosition]="optionIconPosition"
		[formControl]="formControl"
		[filterRegexFlag]="'gi'"
		[filterRegexPattern]="pattern"
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
		[filterRegexPattern]="pattern"
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
		this.icons = [
			'address-book',
			'ald',
			'university',
			'unlink',
			'unlock',
			'upload',
			'user',
			'user-brush',
			'user-checkmark',
			'user-code',
			'user-cog',
			'warning-triangle',
			'weight',
			'wheelchair',
			'wi-fi',
			'wrench'
		];
		this.randomWords = ['Unicorn', 'Dragon', 'Ice-cream', 'Blue', 'Five', 'Graceling realm', 'Baloo the bear', 'Octopus', 'Dr. Who'];
		this.optionList = this.createOptionList(10);
		this.optionGroupList = this.createOptionGroupList(10, this.areDisabled);
		this.updateVisibleOptionList();
	}

	createOptionGroupList(amount: number, disabled = false): ObIAutocompleteInputOptionGroup[] {
		const optionGroupList = [];
		for (let index = 0; index < amount; index++) {
			const groupLabel = `Group - ${index + 1}`;
			const groupOptions = this.createOptionList(Math.floor(Math.random() * 20) + 1, groupLabel, disabled);
			optionGroupList.push({
				groupLabel,
				disabled,
				groupOptions
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
				iconName: this.icons[Math.floor(Math.random() * this.icons?.length - 1) + 1]
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
		// eslint-disable-next-line no-return-assign
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
		if (state) this.formControl.disable();
		else this.formControl.enable();
	}
}
