import {NumberFormatDirective} from './number-format-directive';
import {DelayedChangeDirective} from './delayed-change-directive';
import {EnterDirective} from './enter-directive';
import {DropdownClosableDirective} from './dropdown-closable-directive';
import {UibTypeaheadDirective} from './typeahead-directive';
import {UibTypeaheadPopupDirective} from './typeahead-popup-directive';
import {GiveMeFocusDirective} from './give-me-focus-directive';

export const ORUtilModule = 'oblique-reactive.util';

angular.module(ORUtilModule, [])
    .directive('delayedChange', () => new DelayedChangeDirective())
    .directive('enter', () => new EnterDirective())
    .directive('dropdownClosable', ($timeout:ng.ITimeoutService) => new DropdownClosableDirective($timeout))
    .directive('uibTypeahead', () => new UibTypeaheadDirective())
    .directive('uibTypeaheadPopup', () => new UibTypeaheadPopupDirective())
    .directive('giveMeFocus', () => new GiveMeFocusDirective())
    .directive('numberFormat', ($filter:ng.IFilterService, $parse:ng.IParseService) => new NumberFormatDirective($filter, $parse));
