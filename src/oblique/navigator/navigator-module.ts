import {NavigatorService} from './navigator-service';
import {NavigatorComponent} from './navigator-component';

export const ORNavigatorModule = 'oblique-reactive.navigator';

angular.module(ORNavigatorModule, [])
    .service('$navigator', NavigatorService)
    .component('navigator', new NavigatorComponent());