import { TopControlComponent } from './top-control-component';

import '../../oblique-reactive-templates';

export const ORTopControlModule = 'oblique-reactive.topControl';

angular.module(ORTopControlModule , ['oblique-reactive.app-templates'])
    .component('topControl', new TopControlComponent());
