import {datepicker} from './datepicker/datepicker-sample-module';
import {multiselect} from './multiselect/multiselect-sample-module';
import {navigable} from './navigable/navigable-sample-module';
import {navigator} from './navigator/navigator-sample-module';
import {schemaValidation} from './schema-validation/schema-validation-sample-module';
import {typeahead} from './typeahead/typeahead-sample-module';
import {uiScroll} from './ui-scroll/ui-scroll-sample-module';

export const samples = '__MODULE__.samples';

angular
    .module(samples, [
        'ui.router',
        datepicker,
        multiselect,
        navigable,
        navigator,
        schemaValidation,
        typeahead,
        uiScroll
    ])
    .config(($stateProvider) => {
        $stateProvider.state('samples', {
            url: '/samples',
            abstract: true,
            templateUrl: '../showcase/app/states/samples/samples.tpl.html'
        });
    });

