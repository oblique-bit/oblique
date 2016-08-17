import {HttpDecorator} from '../../../oblique/infrastructure/http-decorator';
import {NotificationService} from '../../../oblique/ui/notifications/notification-service';
import {TypeaheadSampleController} from './typeahead-sample-controller';

export const typeahead = '__MODULE__.samples.typeahead';

angular
    .module(typeahead, [])
    .config(($stateProvider) => {
        $stateProvider.state('samples.typeahead', {
            url: '/typeahead',
            templateUrl: 'samples/typeahead/typeahead-sample.tpl.html',
            controller: 'typeaheadSampleController',
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
    .controller('typeaheadSampleController', TypeaheadSampleController);

