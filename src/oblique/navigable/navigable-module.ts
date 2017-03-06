import {NavigableDirective} from './navigable-directive';

export const ORNavigableModule = 'oblique-reactive.navigable';

angular.module(ORNavigableModule, [])
    .directive('navigable', ($timeout:ng.ITimeoutService) => new NavigableDirective($timeout));