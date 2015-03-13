/* global angular */
(function () {
	'use strict';

	angular.module('__MODULE__.movies')
		.factory('MovieResource', function ($http) {

			// Declaration -------------------------------------------------------------------------------------------------

			return {
				findAll: findAll,
				find: find,
				add: add,
				save: save,
				remove: remove
			};

			// Implementation ----------------------------------------------------------------------------------------------

			function findAll() {
				return $http.api.get('/movies');
			}

			function find(movieId) {
				return $http.api.get('/movies/' + movieId);
			}

			function add(name, description, price) {
				return $http.api.post('/movies', {
					name: name,
					description: description,
					price: price
				});
			}

			function save(movieId, name, description, price) {
				return $http.api.put('/movies/' + movieId, {
					name: name,
					description: description,
					price: price
				});
			}

			function remove(movieId) {
				return $http.api.delete('/movies/' + movieId);
			}
		});
}());
