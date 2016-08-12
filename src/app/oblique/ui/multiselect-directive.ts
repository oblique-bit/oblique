//TODO: refactoring
export const MULTISELECT_CONFIG = {
    extraSettings: {
        buttonClasses: 'btn btn-default',
        idProp: 'id',
        displayProp: 'label',
        externalIdProp: '', // Return the full item model when selected
        scrollable: false,
        showCheckAll: false,
        showUncheckAll: false,
        // TODO fixme that's a hack
        smartButtonMaxItems: 1000
    },
    translationTexts: {
        checkAll: 'multiselect.checkAll',
        uncheckAll: 'multiselect.uncheckAll',
        buttonDefaultText: 'multiselect.buttonDefaultText'
    }
};


/**
 * Wrapper for AngularJS Dropdown Multiselect:
 * http://dotansimha.github.io/angularjs-dropdown-multiselect/
 */
export class MultiselectDirective implements ng.IDirective {
    restrict = 'E';
    template = `<div ng-dropdown-multiselect options='options' 
												selected-model='ngModel' 
												checkboxes='true' 
												extra-settings='settings' 
												translation-texts='translations'></div>`;
    require = 'ngModel';
    scope = {
        ngModel: '=',    // The object the will contain the model for the selected items in the dropdown.
        options: '=',    // The options for the dropdown.
        extraSettings: '&?',   // See 'Settings' section on http://dotansimha.github.io/angularjs-dropdown-multiselect/
        translationTexts: '&?',   // See 'Translation Texts' section on http://dotansimha.github.io/angularjs-dropdown-multiselect/
        dropup: '='     // Defines if a dropup menu should be used instead on a dropdown
    };
    controller = MultiselectDirectiveController;

    constructor(private $filter:ng.IFilterService) {

    }

    link = (scope, element, attrs, ngModelCtrl:ng.INgModelController) => {
        let container = element.find('.multiselect-parent');
        let dropdownMultiselect:any = angular.element(container).scope();
        if (dropdownMultiselect) {
            // Close on ESC keypress:
            element.bind('keydown', (evt) => {
                if (evt.which === 27) { // ESC key
                    evt.preventDefault();
                    evt.stopPropagation();
                    dropdownMultiselect.open = false;
                    // Trigger $digest cycle:
                    scope.$apply();
                }
            });

            // Dropup?
            if (scope.dropup) {
                container.addClass('dropup');
                element.find('.dropdown-toggle').addClass('dropdown-toggle-up');
            }

            // Enable labels translation:
            // FIXME: remove when https://github.com/dotansimha/angularjs-dropdown-multiselect/issues/54
            this.translateLabels(dropdownMultiselect, scope);
            scope.$root.$on('$translateChangeSuccess', (event, data) => {
                this.translateLabels(dropdownMultiselect, scope);
            });
        }

        // Toggle dirty state:
        let originalValue = angular.copy(scope.ngModel);
        scope.$watch('ngModel', (newValue, oldValue) => {
            if (!angular.equals(originalValue, newValue)) {
                ngModelCtrl.$setDirty();
            }
        }, true);
    };

    // FIXME: remove when https://github.com/dotansimha/angularjs-dropdown-multiselect/issues/54
    private translateLabels(dropdownMultiselect, scope) {
        angular.forEach(scope.translations, (value, key) => {
            dropdownMultiselect.texts[key] = this.$filter('translate')(value);
        });
    }
}

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

