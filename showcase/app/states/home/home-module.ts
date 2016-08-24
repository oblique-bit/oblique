import {HomeController} from './home-controller';

export const HomeModule = '__MODULE__.home';

angular
    .module(HomeModule, ['ui.router'])
    .config(($stateProvider: ng.ui.IStateProvider) => {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'home/home.tpl.html',
            controller: 'homeController',
            controllerAs: 'ctrl',
            data: {
                description: 'states.home.description'
            }
        });
    })
    .controller('homeController', HomeController);
