import {ValidationStateSampleController} from './validation-state-sample-controller';

export const ValidationStateModule = '__MODULE__.samples.validation.validationState';

angular
    .module(ValidationStateModule, [])
    .config(($stateProvider) => {
        $stateProvider.state('samples.validation.validationState', {
            url: '/validation-state',
            templateUrl: 'app/states/samples/validation/validation-state/validation-state-sample.tpl.html',
            controller: 'validationStateSampleController',
            controllerAs: 'ctrl'
        });
    })
    .controller('validationStateSampleController', ValidationStateSampleController);
