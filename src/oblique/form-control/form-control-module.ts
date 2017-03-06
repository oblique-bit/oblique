import {FormControlComponent} from './form-control-component';

export const ORFormControlModule = 'oblique-reactive.formControl';

angular.module(ORFormControlModule, [])
    .component('formControl', new FormControlComponent());