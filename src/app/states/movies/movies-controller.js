(function () {
	'use strict';

	angular
		.module('__MODULE__.movies')
		.controller('MoviesController', function ($scope, $stateParams, MovieService) {

			var $this = this;

			// Properties --------------------------------------------------------------------------------------------------
			$scope.query = $stateParams.query;
			$scope.movies = MovieService.movies;

			// Public Methods ----------------------------------------------------------------------------------------------

			$this.reload = MovieService.reload;


			// Initialization ----------------------------------------------------------------------------------------------
			$this.reload();
		});
}());
