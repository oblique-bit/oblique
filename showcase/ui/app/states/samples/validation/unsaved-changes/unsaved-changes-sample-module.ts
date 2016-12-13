import {UnsavedChangesSampleController} from './unsaved-changes-sample-controller';

export const UnsavedChangesModule = '__MODULE__.samples.validation.unsavedChanges';

angular
	.module(UnsavedChangesModule, [])
	.config(($stateProvider) => {
		$stateProvider.state('samples.validation.unsavedChanges', {
			url: '/unsaved-changes',
			templateUrl: 'app/states/samples/validation/unsaved-changes/unsaved-changes-sample.tpl.html',
			controller: 'unsavedChangesSampleController',
			controllerAs: 'ctrl',
			data: {
				description: 'i18n.states.samples.validation.unsavedChanges.description'
			}
		});
	})
	.controller('unsavedChangesSampleController', UnsavedChangesSampleController);
