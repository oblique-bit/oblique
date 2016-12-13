import {SchemaValidationModule} from './schema-validation/schema-validation-sample-module';
import {UnsavedChangesModule} from './unsaved-changes/unsaved-changes-sample-module';
import {ValidationStateModule} from './validation-state/validation-state-sample-module';

export const SamplesValidationModule = '__MODULE__.samples.validation';

angular
	.module(SamplesValidationModule, [
		'ui.router',
		SchemaValidationModule,
		UnsavedChangesModule,
		ValidationStateModule
	])
	.config(($stateProvider) => {
		$stateProvider.state('samples.validation', {
			url: '/validation',
			abstract: true,
			template: '<div ui-view></div>'
		});
	});

