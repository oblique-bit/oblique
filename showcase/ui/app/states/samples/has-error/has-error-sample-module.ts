import {HasErrorSampleController} from './has-error-sample-controller';

export const HasErrorModule = '__MODULE__.samples.hasError';

angular
    .module(HasErrorModule, [])
    .config(($stateProvider) => {
        $stateProvider.state('samples.hasError', {
            url: '/has-error',
            templateUrl: 'app/states/samples/has-error/has-error-sample.tpl.html',
            controller: 'hasErrorSampleController',
            controllerAs: 'ctrl'
        });
    })
    .controller('hasErrorSampleController', HasErrorSampleController);

