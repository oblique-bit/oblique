export class ErrorMessagesComponent implements ng.IComponentOptions {
    require = {
        form: "^form",
        formControl: "?^formControl"
    };
    transclude = true;

    bindings = {
        fieldName: "@"
    };

    controllerAs = "ctrl";
    template = `<div ng-messages="ctrl.form[ctrl.fieldName].$error" class="help-block"
                 ng-show="((ctrl.form.$submitted || ctrl.form[ctrl.fieldName].$dirty) && ctrl.form[ctrl.fieldName].$invalid) || ctrl.formControl.pristineValidation"
                 ng-transclude>
                </div>`;

}