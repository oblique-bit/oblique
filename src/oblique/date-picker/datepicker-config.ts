export interface DatepickerPopupConfig extends ng.ui.bootstrap.IDatepickerPopupConfig {
	modelAsIsoFormat: string|boolean;
	altInputFormats: string[];
	// TODO: remove this when https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9342
	minDate;
	maxDate;

	showErrorMessages: boolean;
}
