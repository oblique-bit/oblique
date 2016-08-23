import {HomeController} from './home-controller';

export const home = '__MODULE__.home';

angular
    .module(home, ['ui.router'])
    .config(($stateProvider: ng.ui.IStateProvider) => {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '../showcase/app/states/home/home.tpl.html',
            controller: 'homeController',
            controllerAs: 'ctrl',
            data: {
                description: 'states.home.description'
            }
        });
    })
    .controller('homeController', HomeController);
