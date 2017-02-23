import {NavigatorSampleController} from './navigator-sample-controller';

export const NavigatorModule = '__MODULE__.samples.navigator';

angular
	.module(NavigatorModule, [])
	.config(($stateProvider) => {
		$stateProvider.state('samples.navigator', {
			url: '/navigator',
			templateUrl: 'app/states/samples/navigator/navigator-sample.tpl.html',
			controller: 'navigatorSampleController',
			controllerAs: 'ctrl'
		}).state('samples.navigator.1', {
			url: '/1',
			template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 1</span>'
		}).state('samples.navigator.2', {
			url: '/2',
			template: '<span class="sample-node fa fa-chevron-right"></span> <a class="thumbnail well pull-left" ui-sref="samples.navigator.2">Child state 2</a> <span ui-view></span>'
		}).state('samples.navigator.2.1', {
			url: '/1',
			template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 2.1</span>'
		}).state('samples.navigator.2.2', {
			url: '/2',
			template: '<span class="sample-node fa fa-chevron-right"></span> <a class="thumbnail well pull-left" ui-sref="samples.navigator.2.2">Child state 2.2</a> <span ui-view></span>'
		}).state('samples.navigator.2.2.1', {
			url: '/1',
			template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 2.2.1</span>'
		}).state('samples.navigator.2.2.2', {
			url: '/2',
			template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 2.2.2</span>',
			data: {
				navigator: {
					up: 'samples.navigator'
				}
			}
		}).state('samples.navigator.2.2.3', {
			url: '/3',
			template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 2.2.3</span>'
		}).state('samples.navigator.3', {
			url: '/3',
			template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 3</span>'
		}).state('samples.navigator.4', {
			url: '/4',
			template: '<span class="sample-node fa fa-chevron-right"></span> <a class="thumbnail well pull-left" ui-sref="samples.navigator.4">Child state 4</a> <span ui-view></span>'
		}).state('samples.navigator.4.1', {
			url: '/1',
			template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 4.1</span>'
		}).state('samples.navigator.4.2', {
			url: '/2',
			template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 4.2</span>'
		}).state('samples.navigator.4.3', {
			url: '/3',
			template: '<span class="sample-node fa fa-chevron-right"></span> <span class="sample-node">Child state 4.3</span>'
		});
	})
	.controller('navigatorSampleController', NavigatorSampleController);
