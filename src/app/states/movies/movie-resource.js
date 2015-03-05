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
				return $http.apiGet('/movies');
			}

			function find(movieId) {
				return $http.apiGet('/movies/' + movieId);
			}

			function add(name, description, price) {
				return $http.apiPost('/movies', {
					name: name,
					description: description,
					price: price
				});
			}

			function save(movieId, name, description, price) {
				return $http.apiPut('/movies/' + movieId, {
					name: name,
					description: description,
					price: price
				});
			}

			function remove(movieId) {
				return $http.apiDelete('/movies/' + movieId);
			}
		});
}());
