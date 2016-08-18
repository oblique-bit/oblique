export interface DatepickerPopupConfig extends ng.ui.bootstrap.IDatepickerPopupConfig {
    modelAsIsoFormat: string|boolean;
    altInputFormats: string[];
    //TODO remove this as soon as this is fixed: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/9342
    minDate;
    maxDate;
}