export class MultiselectDirectiveController {
    /*@ngInject*/
    constructor($scope, multiselectConfig) {
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