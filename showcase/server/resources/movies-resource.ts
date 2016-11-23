let router = require('express').Router();
let movies = require('../data/movies.json');

// API - Movies
// ------------------------------------
module.exports = (config, auth) => {

	router.get('/', (request, response) => {
		response.send(movies);
	});

	router.get('/:id', (request, response) => {
		let results = movies.filter((item) => {
			return item.id === request.params.id;
		});
		response.send(results && results.length ? results[0] : null);
	});

	return router;
};
