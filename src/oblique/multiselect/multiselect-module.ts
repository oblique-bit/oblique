import {MultiselectConfig} from './multiselect-config';
import {MultiselectComponent} from './multiselect-component';

export const ORMultiselectModule = 'oblique-reactive.multiselect';

angular.module(ORMultiselectModule, [])
    .constant('multiselectConfig', new MultiselectConfig())
    .component('multiselect', new MultiselectComponent());