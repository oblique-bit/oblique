import {MultiselectSampleController} from './multiselect-sample-controller';

export const multiselect = '__MODULE__.samples.multiselect';

angular
    .module(multiselect, [])
    .config(($stateProvider) => {
        $stateProvider.state('samples.multiselect', {
            url: '/multiselect',
            templateUrl: '../showcase/app/states/samples/multiselect/multiselect-sample.tpl.html',
            controller: 'multiselectSampleController',
            controllerAs: 'ctrl'
        });
    })
    .controller('multiselectSampleController', MultiselectSampleController);

