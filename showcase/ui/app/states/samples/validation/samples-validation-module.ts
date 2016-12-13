import {SchemaValidationModule} from './schema-validation/schema-validation-sample-module';
import {UnsavedChangesModule} from './unsaved-changes/unsaved-changes-sample-module';

export const SamplesValidationModule = '__MODULE__.samples.validation';

angular
	.module(SamplesValidationModule, [
		'ui.router',
		SchemaValidationModule,
		UnsavedChangesModule
	])
	.config(($stateProvider) => {
		$stateProvider.state('samples.validation', {
			url: '/validation',
			abstract: true,
			template: '<div ui-view></div>'
		});
	});

