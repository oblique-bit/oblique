import {NumberFormatDirective} from './number-format-directive';
import {DelayedChangeDirective} from './delayed-change-directive';
import {EnterDirective} from './enter-directive';
import {DropdownClosableDirective} from './dropdown-closable-directive';
import {GiveMeFocusDirective} from './give-me-focus-directive';

export const ORUtilModule = 'oblique-reactive.util';

angular.module(ORUtilModule, [])
    .directive('delayedChange', () => new DelayedChangeDirective())
    .directive('enter', () => new EnterDirective())
    .directive('dropdownClosable', ($timeout:ng.ITimeoutService) => new DropdownClosableDirective($timeout))
    .directive('giveMeFocus', () => new GiveMeFocusDirective())
    .directive('numberFormat', ($filter:ng.IFilterService, $parse:ng.IParseService) => new NumberFormatDirective($filter, $parse));
