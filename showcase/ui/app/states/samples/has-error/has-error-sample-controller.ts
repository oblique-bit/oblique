export class HasErrorSampleController {
    public setInvalid(ngModelCtrl: ng.INgModelController) {
        ngModelCtrl.$setViewValue('FUUBAr');
    }
}