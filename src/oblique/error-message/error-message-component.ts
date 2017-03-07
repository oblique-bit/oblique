export class ErrorMessageComponent implements ng.IComponentOptions {
    require = {
        form: "^form"
    };
    transclude = true;

    bindings = {
        fieldName: "@"
    };

    controllerAs = "ctrl";
    template = `<div ng-messages="ctrl.form[ctrl.fieldName].$error"
                 ng-show="ctrl.form.$submitted || ctrl.form[ctrl.fieldName].$invalid"
                 >
                 <div ng-transclude></div>
                </div>`;

}