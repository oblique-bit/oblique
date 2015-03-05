/* global angular */
(function () {
	"use strict";

	angular
		.module('__MODULE__.movies')
		.factory('MovieService', function (MovieResource) {

			// Private variables

			var model = [];

			// Declaration -------------------------------------------------------------------------------------------------

			return {
				// Properties
				movies: model,

				// Methods
				reload: reload,
				add: add,
				save: save,
				remove: remove
			};

			// Implementation ----------------------------------------------------------------------------------------------

			function reload() {
				return MovieResource.findAll().then(function (movies) {
					angular.copy(movies, model);
				});
			}

			function add(movie) {
				return MovieResource.add(movie.name, movie.description, movie.year);
			}

			function save(movie) {
				return MovieResource.save(movie.movieId, movie.name, movie.description, movie.year);
			}

			function remove(movieId) {
				return MovieResource.remove(movieId);
			}
		});
}());
