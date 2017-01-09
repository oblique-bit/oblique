import {FormControlSampleController} from './form-control-sample-controller';

export const FormControlModule = '__MODULE__.samples.validation.formControl';

angular
    .module(FormControlModule, [])
    .config(($stateProvider) => {
        $stateProvider.state('samples.validation.formControl', {
            url: '/form-control',
            templateUrl: 'app/states/samples/validation/form-control/form-control-sample.tpl.html',
            controller: 'formControlSampleController',
            controllerAs: 'ctrl'
        });
    })
    .controller('formControlSampleController', FormControlSampleController);
