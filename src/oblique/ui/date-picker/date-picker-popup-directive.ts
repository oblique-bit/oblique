/**
 * DatepickerPopup extensions:
 *  - validation of ISO-formatted date strings (no more accepted by AngularUI v0.13.3)
 *  - validation of ISO-formatted date strings (no more accepted since AngularUI v0.13.3)
 *  - ISO model values only
 *
 * See:
 *  - https://github.com/angular-ui/bootstrap/issues/4233
 */
export class DatePickerPopupDirective {
    restrict = 'A';
    priority = 9999;
    require = 'ngModel';

    constructor(private dateFilter,
                private uibDateParser,
                private uibDatepickerPopupConfig) {

    }

    link = (scope, element, attrs, ngModel:ng.INgModelController) => {

        // Check for ISO model values:
        if (this.uibDatepickerPopupConfig.modelAsIsoFormat) {
            ngModel.$formatters.push((value) => {
                return this.uibDateParser.parse(value, this.uibDatepickerPopupConfig.modelAsIsoFormat);
            });

            ngModel.$parsers.push((value) => {
                if (angular.isDate(value)) {
                    return this.dateFilter(value, this.uibDatepickerPopupConfig.modelAsIsoFormat);
                }
                return value;
            });

            //We have to override the date validator from ui-bootstrap or add modelAsIsoFormat to altInputFormats
            let oldDateValidator = ngModel.$validators['date'];
            ngModel.$validators['date'] = (modelValue:string, viewValue:string) => {
                if(!oldDateValidator(modelValue, viewValue)) {
                    return !!(this.uibDateParser.parse(modelValue, this.uibDatepickerPopupConfig.modelAsIsoFormat));
                }
                return true;
            };
        }
    };
}