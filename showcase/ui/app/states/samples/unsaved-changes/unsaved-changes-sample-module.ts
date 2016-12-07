import {UnsavedChangesSampleController} from './unsaved-changes-sample-controller';

export const UnsavedChangesModule = '__MODULE__.samples.unsavedChanges';

angular
	.module(UnsavedChangesModule, [])
	.config(($stateProvider) => {
		$stateProvider.state('samples.unsavedChanges', {
			url: '/unsaved-changes',
			templateUrl: 'app/states/samples/unsaved-changes/unsaved-changes-sample.tpl.html',
			controller: 'unsavedChangesSampleController',
			controllerAs: 'ctrl',
			data: {
				description: 'states.samples.unsaved-changes.description'
			}
		});
	})
	.controller('unsavedChangesSampleController', UnsavedChangesSampleController);

