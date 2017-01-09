// API - Countries
// ------------------------------------
module.exports = (config, auth) => {
	let router = require('express').Router();
	let countries = require('../data/countries.json');

	router.get('/', (request, response) => {
		response.send(countries);
	});

	router.get('/:code', (request, response) => {
		let results = countries.filter((item) => {
			return item.code === request.params.code;
		});
		response.send(results && results.length ? results[0] : null);
	});

	return router;
};
