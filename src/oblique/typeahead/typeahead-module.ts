import {UibTypeaheadDirective} from './typeahead-directive';
import {UibTypeaheadPopupDirective} from './typeahead-popup-directive';

export const ORTypeaheadModule = 'oblique-reactive.typeahead';

angular.module(ORTypeaheadModule , [])
    .directive('uibTypeahead', () => new UibTypeaheadDirective())
    .directive('uibTypeaheadPopup', () => new UibTypeaheadPopupDirective());