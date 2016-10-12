import {NotificationService, HttpDecorator} from 'oblique-reactive/oblique-reactive';

import {UiScrollSampleController} from './ui-scroll-sample-controller';

export const UiScrollModule = '__MODULE__.samples.uiScroll';

angular
    .module(UiScrollModule, [])
    .config(($stateProvider) => {
        $stateProvider.state('samples.uiScroll', {
            url: '/ui-scroll',
            templateUrl: 'samples/ui-scroll/ui-scroll-sample.tpl.html',
            controller: 'uiScrollSampleController',
            controllerAs: 'ctrl',
            resolve: {
                countries: ($http:HttpDecorator, notificationService:NotificationService) => {
                    return $http.api.get('/countries').catch(() => {
                        notificationService.error('Unable to load countries from server!');
                    });
                }
            }
        });
    })
    .controller('uiScrollSampleController', UiScrollSampleController);

