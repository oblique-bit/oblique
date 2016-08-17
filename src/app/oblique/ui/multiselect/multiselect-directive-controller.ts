import {MultiselectConfig} from './multiselect-config';

export class MultiselectDirectiveController {
    //todo: controllerAs
    /*@ngInject*/
    constructor($scope, multiselectConfig:MultiselectConfig) {
        // Configuration:
        $scope.settings = angular.extend(multiselectConfig.extraSettings, $scope.extraSettings ? $scope.extraSettings() : {});
        $scope.translations = angular.extend(
            multiselectConfig.translationTexts,
            $scope.translationTexts ? $scope.translationTexts() : {}
        );

        // Binding:
        $scope.ngModel = $scope.ngModel || [];
    }
}