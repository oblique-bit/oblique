export class ValidationStateSampleController {
    public setInvalid(ngModelCtrl: ng.INgModelController) {
        ngModelCtrl.$setViewValue('Invalid');
        ngModelCtrl.$render();
    }

    public setValid(ngModelCtrl: ng.INgModelController) {
        ngModelCtrl.$setViewValue(42);
        ngModelCtrl.$render();
    }
}