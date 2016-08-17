import {UiScrollSampleController} from './ui-scroll-sample-controller';
import {NotificationService} from '../../../oblique/ui/notifications/notification-service';
import {HttpDecorator} from '../../../oblique/infrastructure/http-decorator';

export const uiScroll = '__MODULE__.samples.uiScroll';

angular
    .module(uiScroll, [])
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

