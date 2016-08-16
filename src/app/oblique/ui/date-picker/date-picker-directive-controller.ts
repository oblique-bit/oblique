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