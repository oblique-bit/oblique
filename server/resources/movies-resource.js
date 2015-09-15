var router = require('express').Router();
var movies = require('../data/movies.json');

// API - Users
// ------------------------------------
module.exports = function(config, auth) {

	router.get('/', function (request, response) {
		response.send(movies);
	});

	router.get('/:id', function (request, response) {
		var results = movies.filter(function(item) {
			return item.id == request.params.id;
		});
		response.send(results && results.length ? results[0] : null);
	});

	return router;
};
