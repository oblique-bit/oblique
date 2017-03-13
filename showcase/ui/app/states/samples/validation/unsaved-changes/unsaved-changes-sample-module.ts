import {UnsavedChangesSampleController} from './unsaved-changes-sample-controller';
import {UnsavedChangesModalSampleController} from './unsaved-changes-modal-sample-controller';
import IModalService = angular.ui.bootstrap.IModalService;

export const UnsavedChangesModule = '__MODULE__.samples.validation.unsavedChanges';

angular
	.module(UnsavedChangesModule, [])
	.config(($stateProvider) => {
		$stateProvider
			.state('samples.validation.unsavedChanges', {
				url: '/unsaved-changes',
				templateUrl: 'app/states/samples/validation/unsaved-changes/unsaved-changes-sample.tpl.html',
				controller: 'unsavedChangesSampleController',
				controllerAs: 'ctrl',
				data: {
					description: 'i18n.states.samples.validation.unsavedChanges.description'
				}
			})
			.state('samples.validation.unsavedChanges.modal', {
				url: '/modal',
				onEnter: ($state, $uibModal: IModalService) => {
					$uibModal.open({
						templateUrl: 'app/states/samples/validation/unsaved-changes/unsaved-changes-modal-sample.tpl.html',
						controller: 'unsavedChangesModalSampleController',
						controllerAs: 'ctrl'
					}).result.then(() => {
						$state.go('^');
					}, () => {
						$state.go('^');
					});
				},
				data: {
					description: 'i18n.states.samples.validation.unsavedChanges.modal.description'
				}
			});
	})
	.controller('unsavedChangesSampleController', UnsavedChangesSampleController)
	.controller('unsavedChangesModalSampleController', UnsavedChangesModalSampleController);
