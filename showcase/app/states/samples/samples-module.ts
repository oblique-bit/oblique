import {DatepickerModule} from './datepicker/datepicker-sample-module';
import {MultiselectModule} from './multiselect/multiselect-sample-module';
import {NavigableModule} from './navigable/navigable-sample-module';
import {NavigatorModule} from './navigator/navigator-sample-module';
import {SchemaValidationModule} from './schema-validation/schema-validation-sample-module';
import {TypeaheadModule} from './typeahead/typeahead-sample-module';
import {UiScrollModule} from './ui-scroll/ui-scroll-sample-module';

export const SamplesModule = '__MODULE__.samples';

angular
	.module(SamplesModule, [
		'ui.router',
		DatepickerModule,
		MultiselectModule,
		NavigableModule,
		NavigatorModule,
		SchemaValidationModule,
		TypeaheadModule,
		UiScrollModule
	])
	.config(($stateProvider) => {
		$stateProvider.state('samples', {
			url: '/samples',
			abstract: true,
			templateUrl: 'app/states/samples/samples.tpl.html'
		});
	});

