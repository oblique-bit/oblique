import {NavigableSampleController} from './navigable-sample-controller';

export const navigable = '__MODULE__.samples.navigable';
angular
    .module(navigable, [])
    .config(($stateProvider) => {
        $stateProvider.state('samples.navigable', {
            url: '/navigable',
            templateUrl: 'samples/navigable/navigable-sample.tpl.html',
            controller: 'navigableSampleController',
            controllerAs: 'ctrl'
        });
    })
    .controller('navigableSampleController', NavigableSampleController);

