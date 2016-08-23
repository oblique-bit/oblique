import {NavigatorSampleController} from './navigator-sample-controller';

export const navigator = '__MODULE__.samples.navigator';

angular
    .module(navigator, [])
    .config(($stateProvider) => {
        $stateProvider.state('samples.navigator', {
            url: '/navigator',
            templateUrl: '../showcase/app/states/samples/navigator/navigator-sample.tpl.html',
            controller: 'navigatorSampleController',
            controllerAs: 'ctrl'
        }).state('samples.navigator.1', {
            url: '/1',
            template: '<span class="fa fa-chevron-right"></span> Child state 1'
        }).state('samples.navigator.2', {
            url: '/2',
            template: '<span class="fa fa-chevron-right"></span> <a ui-sref="samples.navigator.2">Child state 2</a> <span ui-view></span>'
        }).state('samples.navigator.2.1', {
            url: '/1',
            template: '<span class="fa fa-chevron-right"></span> Child state 2.1'
        }).state('samples.navigator.2.2', {
            url: '/2',
            template: '<span class="fa fa-chevron-right"></span> <a ui-sref="samples.navigator.2.2">Child state 2.2</a> <span ui-view></span>'
        }).state('samples.navigator.2.2.1', {
            url: '/1',
            template: '<span class="fa fa-chevron-right"></span> Child state 2.2.1'
        }).state('samples.navigator.2.2.2', {
            url: '/2',
            template: '<span class="fa fa-chevron-right"></span> Child state 2.2.2',
            navigator: {
                up: 'samples.navigator'
            }
        }).state('samples.navigator.2.2.3', {
            url: '/3',
            template: '<span class="fa fa-chevron-right"></span> Child state 2.2.3'
        }).state('samples.navigator.3', {
            url: '/3',
            template: '<span class="fa fa-chevron-right"></span> Child state 3'
        }).state('samples.navigator.4', {
            url: '/4',
            template: '<span class="fa fa-chevron-right"></span> <a ui-sref="samples.navigator.4">Child state 4</a> <span ui-view></span>'
        }).state('samples.navigator.4.1', {
            url: '/1',
            template: '<span class="fa fa-chevron-right"></span> Child state 4.1'
        }).state('samples.navigator.4.2', {
            url: '/2',
            template: '<span class="fa fa-chevron-right"></span> Child state 4.2'
        }).state('samples.navigator.4.3', {
            url: '/3',
            template: '<span class="fa fa-chevron-right"></span> Child state 4.3'
        });
    })
    .controller('navigatorSampleController', NavigatorSampleController);

