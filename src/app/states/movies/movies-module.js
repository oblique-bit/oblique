(function () {
	'use strict';

	angular
		.module('__MODULE__.movies', ['ui.router'])
		.config(function ($stateProvider) {
			$stateProvider.state('movies', {
				url: '/movies?query',
				templateUrl: 'app/states/movies/movies.tpl.html',
				controller: 'MoviesController'
			});
		});
}());
