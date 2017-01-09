import {MoviesController} from './movies-controller';
import {MovieService} from './movie-service';

export const MoviesModule = '__MODULE__.movies';

angular
	.module(MoviesModule, ['ui.router'])
	.config(($stateProvider:ng.ui.IStateProvider) => {
		$stateProvider.state('movies', {
			url: '/movies?query',
			templateUrl: 'app/states/movies/movies.tpl.html',
			controller: 'moviesController',
			controllerAs: 'ctrl'
		});
	})
	.controller('moviesController', MoviesController)
	.service('movieService', MovieService);
