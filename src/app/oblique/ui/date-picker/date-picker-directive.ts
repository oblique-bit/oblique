//TODO: rewrite to controllerAs syntax and split up

/**
 * Wrapper for UI Bootstrap `datepicker` directive:
 * https://angular-ui.github.io/bootstrap/#/datepicker
 */
export class DatePickerDirective implements ng.IDirective {
    templateUrl = '../oblique/ui/date-picker/date-picker.tpl.html';
    restrict = 'E';
    replace = true;
    scope = {
        ngModel: '=',
        minDate: '=',
        maxDate: '=',
        options: '&?', // See UI Bootstrap `datepicker` 'Popup Settings'
        disabled: '=?ngDisabled',
        required: '=?ngRequired',
        editable: '=?', // Manual edition
        label: '@label',
        name: '@',
        controlId: '@',
        controlSize: '@', // 'sm'
        showClearControl: '=?'
    };
    controller = DatePickerDirectiveController;

    link = (scope, element, attrs) => {

        scope.toggle = ($event) => {
            $event.preventDefault();
            $event.stopPropagation();

            scope.opened = !scope.opened;
        };

        scope.clear = () => {
            scope.ngModel = null;
        };

        // Bind event listeners:
        element.keydown((e) => {
            let control = element.find('input[name=' + scope.name + ']');
            if (angular.element(e.target).is(control) && e.keyCode === 40) { // 40: ArrowDown
                scope.$apply(() => {
                    scope.toggle(e);
                });
            }
        });
    };
}

export class DatePickerDirectiveController {
    public format;

    /*@ngInject*/
    constructor($scope, uibDatepickerPopupConfig:angular.ui.bootstrap.IDatepickerPopupConfig) {
        $scope.config = angular.extend({}, uibDatepickerPopupConfig, $scope.options || {});
        $scope.editable = angular.isDefined($scope.editable) ? $scope.editable : true;
        $scope.showClearControl = angular.isDefined($scope.showClearControl) ? $scope.showClearControl : true;
        $scope.opened = false;

        // Public API:
        this.format = $scope.config.datepickerPopup;
    }
}


/**
 * DatepickerPopup extensions:
 *  - validation of ISO-formatted date strings (no more accepted by AngularUI v0.13.3)
 *  - validation of limit dates (minDate/maxDate)
 *  - activation of ranges (by watching minDate/maxDate properties)
 *  - ISO model values only
 *
 * See:
 *  - https://github.com/angular-ui/bootstrap/issues/4233
 */
export class DatePickerPopupDirective {
    restrict = 'A';
    priority = 1000;
    require = ['ngModel', '^datePicker'];

    private originalValidator;
    private dateFormat;

    constructor(private dateFilter,
                private $dateParser,
                private uibDatepickerPopupConfig) {

    }

    link = (scope, element, attrs, params) => {
        let ngModel = params[0];
        let datePicker = params[1];
        this.dateFormat = datePicker.format || this.uibDatepickerPopupConfig.datepickerPopup;
        this.originalValidator = ngModel.$validators.date;

        ngModel.$validators.date = (modelValue, viewValue) => {
            return this.isDateValid(modelValue, viewValue);
        };

        ngModel.$validators.minDate = (modelValue, viewValue) => {
            // Validate only if view value is set and valid:
            let minDate = this.parse(scope.minDate);
            if (minDate && viewValue && this.isDateValid(modelValue, viewValue)) {
                return this.compare(this.parse(viewValue), minDate) >= 0;
            }
            return true;
        };

        ngModel.$validators.maxDate = (modelValue, viewValue) => {
            // Validate only if view value is set and valid:
            let maxDate = this.parse(scope.maxDate);
            if (maxDate && viewValue && this.isDateValid(modelValue, viewValue)) {
                return this.compare(this.parse(viewValue), maxDate) <= 0;
            }
            return true;
        };

        scope.$watchGroup(['minDate', 'maxDate'], (newValues, oldValues) => {
            if (!angular.equals(newValues, oldValues)) {
                // Apply model validation as its value may be out of limits:
                ngModel.$validate();
            }
        });

        // Check for ISO model values:
        if (this.uibDatepickerPopupConfig.useIsoModel) {
            ngModel.$parsers.push((value) => {
                if (angular.isDate(value)) {
                    return this.dateFilter(value, 'yyyy-MM-dd');
                }
                return value;
            });
        }
    };

    private isDateValid(modelValue, viewValue) {
        let valid = this.originalValidator(modelValue, viewValue);
        if (!valid) {
            // Try to validate again as date may originate from an ISO-formatted date:
            let date = this.parse(viewValue);
            valid = viewValue === null || viewValue === '' || angular.isDate(date);
        }
        return valid;
    }

    private parse(viewValue) {
        return this.$dateParser(viewValue, this.dateFormat);
    }

    //  <0 : if date1 < date2
    //   0 : if date1 = date2
    //  >0 : if date1 > date2
    private compare(date1, date2) {
        date1.setHours(0, 0, 0, 0);
        date2.setHours(0, 0, 0, 0);
        return date1.getTime() - date2.getTime();
    }
}
