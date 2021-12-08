import {Component, Input, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ObMockMultiselectTexts} from './mock-multiselect.texts';

@Component({
	selector: 'ob-multiselect',
	exportAs: 'obMultiselect',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ObMockMultiselectComponent),
			multi: true
		}
	],
	template: ''
})
export class ObMockMultiselectComponent implements ControlValueAccessor {
	@Input() options: any[] = [];
	@Input() texts: ObMockMultiselectTexts;
	@Input() dropup = false;
	@Input() labelProperty: string;
	@Input() labelFormatter: (option: any) => string;
	@Input() titleProperty: string;
	@Input() titleFormatter: (option: any) => string;
	@Input() idPrefix = 'multiselect';

	@Input() enableAllSelectedText;
	@Input() dynamicTitleMaxItems;
	@Input() enableSearch;
	@Input() maxHeight;
	@Input() selectionLimit;
	@Input() showCheckAll;
	@Input() showUncheckAll;

	idContainer = 'multiselect-container';
	model: any[] = [];
	title: string;
	titleTranslateParams: any = {};
	differ: any;
	isVisible = false;
	searchFilterText = '';
	disabled = false;

	onClick(target: HTMLElement) {}

	onKeyup($event: KeyboardEvent): void {}

	onModelChange: (_: any) => void = (_: any) => {};

	onModelTouched: () => void = () => {};

	writeValue(value: any): void {}

	registerOnChange(fn: (_: any) => void): void {}

	registerOnTouched(fn: () => void): void {}

	setDisabledState(isDisabled: boolean): void {}

	toggleDropdown(): void {}

	isSelected(option): boolean {
		return true;
	}

	toggleSelection(option): void {}

	updateTitle(): void {}

	checkAll(): void {}

	uncheckAll(): void {}

	preventCheckboxCheck(event: Event): void {}

	formatOptionForLabel(item: any): string {
		return item;
	}

	formatOptionForTitle(item: any): string {
		return '';
	}
}
