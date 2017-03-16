import {ErrorMessagesComponent} from './error-messages-component';

export const ORErrorMessagesModule = 'oblique-reactive.errorMessages';

angular.module(ORErrorMessagesModule, [])
    .component('errorMessages', new ErrorMessagesComponent());