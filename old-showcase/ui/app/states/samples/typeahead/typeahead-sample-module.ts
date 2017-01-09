import {HttpDecorator, NotificationService} from 'oblique-reactive/../../../../../../old-lib/oblique-reactive';
import {TypeaheadSampleController} from './typeahead-sample-controller';

export const TypeaheadModule = '__MODULE__.samples.typeahead';

angular
	.module(TypeaheadModule, [])
	.config(($stateProvider) => {
		$stateProvider.state('samples.typeahead', {
			url: '/typeahead',
			templateUrl: 'app/states/samples/typeahead/typeahead-sample.tpl.html',
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

