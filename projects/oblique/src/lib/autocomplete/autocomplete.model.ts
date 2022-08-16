import {ObEIcon} from '../icon/icon.model';

export interface ObIAutocompleteInputOption {
	label: string;
	iconName?: ObEIcon;
	disabled?: boolean;
}

export interface ObIAutocompleteInputOptionGroup {
	groupLabel: string;
	groupOptions: ObIAutocompleteInputOption[];
	disabled?: boolean;
}

export type OptionLabelIconPosition = 'start' | 'end' | 'none';
