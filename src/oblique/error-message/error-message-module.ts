import {ErrorMessageComponent} from './error-message-component';

export const ORErrorMessageModule = 'oblique-reactive.errorMessage';

angular.module(ORErrorMessageModule, [])
    .component('errorMessage', new ErrorMessageComponent());