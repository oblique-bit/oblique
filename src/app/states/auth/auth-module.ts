import {AuthController} from './auth-controller';

export const auth = 'auth';

angular
    .module('__MODULE__.auth', ['ui.router'])
    .config(($stateProvider) => {
        $stateProvider.state('auth', {
            url: '/auth',
            templateUrl: 'auth/auth.tpl.html',
            controller: 'AuthController',
            controllerAs: 'ctrl',
            data: {
                layout: {
                    variant: 'no-navigation has-cover'
                }
            }
        });
    })
    .controller('AuthController',AuthController);

