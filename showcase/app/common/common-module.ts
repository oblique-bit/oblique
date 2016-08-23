import {AuthService} from './auth/auth-service';

export const common = '__MODULE__.common';

angular.module('__MODULE__.common', [])
    .filter('asDate', ['$filter', ($filter) => {
        return (input) => {
            return input ? $filter('date')(new Date(input), 'dd.MM.yyyy') : input;
        };
    }])
    .filter('asLongDate', ['$filter', ($filter) => {
        return (input) => {
            return input ? $filter('date')(new Date(input), 'EEEE d MMMM yyyy') : input;
        };
    }])
    .filter('asMediumDate', ['$filter', ($filter) => {
        return (input) => {
            return input ? $filter('date')(new Date(input), 'EEE, d MMM yyyy') : input;
        };
    }])
    .filter('asLongMonth', ['$filter', ($filter) => {
        return (input) => {
            return input ? $filter('date')(new Date(input), 'MMMM yyyy') : input;
        };
    }])
    .filter('asDateTime', ['$filter', ($filter) => {
        return (input) => {
            return input ? $filter('date')(new Date(input), 'dd.MM.yyyy HH:mm') : input;
        };
    }])
    .service('authService', AuthService);

