import {ObEIcon} from '../icon/icon.model';

export interface ObIAutocompleteInputOption<T = string> {
	label: T;
	iconName?: ObEIcon;
	disabled?: boolean;
	ariaLabel?: string;
}

export interface ObIAutocompleteInputOptionGroup<T = string> {
	groupLabel: string;
	groupOptions: ObIAutocompleteInputOption<T>[];
	disabled?: boolean;
}

export type OptionLabelIconPosition = 'start' | 'end' | 'none';
