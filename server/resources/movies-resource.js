var router = require('express').Router();
var movies = require('../data/movies.json');

// API - Users
// ------------------------------------
module.exports = function(config, auth) {

	router.get('/', function (request, response) {
		response.send(movies);
	});

	return router;
}
