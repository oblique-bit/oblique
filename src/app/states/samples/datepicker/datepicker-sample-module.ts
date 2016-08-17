import {DatepickerSampleController} from './datepicker-sample-controller';

export const datepicker = '__MODULE__.samples.datepicker';

angular
    .module(datepicker, [])
    .config(($stateProvider) => {
        $stateProvider.state('samples.datepicker', {
            url: '/datepicker',
            templateUrl: 'samples/datepicker/datepicker-sample.tpl.html',
            controller: 'datepickerSampleController',
            controllerAs: 'ctrl'
        });
    })
    .controller('datepickerSampleController', DatepickerSampleController);
