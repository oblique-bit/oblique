import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MockMultiselectTexts} from './mock-multiselect.texts';

@Component({
	selector: 'or-multiselect',
	exportAs: 'orMultiselect',
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => MockMultiselectComponent),
		multi: true
	}],
	template: ''
})
export class MockMultiselectComponent implements ControlValueAccessor {
	@Input() options: any[] = [];
	@Input() texts: MockMultiselectTexts;
	@Input() dropup = false;
	@Input() disabled = false;
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

	onClick(target: HTMLElement) {
	}

	onKeyup($event: KeyboardEvent): void {
	}

	onModelChange: (_: any) => void = (_: any) => {
	}

	onModelTouched: () => void = () => {
	}

	writeValue(value: any): void {
	}

	registerOnChange(fn: (_: any) => void): void {
	}

	registerOnTouched(fn: () => void): void {
	}

	setDisabledState(isDisabled: boolean): void {
	}

	toggleDropdown(): void {
	}

	isSelected(option): boolean {
		return true;
	}

	toggleSelection(option): void {
	}

	updateTitle(): void {
	}

	checkAll(): void {
	}

	uncheckAll(): void {
	}

	preventCheckboxCheck(event: Event): void {
	}

	formatOptionForLabel(item: any): string {
		return item;
	}

	formatOptionForTitle(item: any): string {
		return '';
	}
}
