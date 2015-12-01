var router = require('express').Router();
var countries = require('../data/countries.json');

// API - Countrie
// ------------------------------------
module.exports = function(config, auth) {

	router.get('/', function (request, response) {
		response.send(countries);
	});

	router.get('/:code', function (request, response) {
		var results = countries.filter(function(item) {
			return item.code == request.params.code;
		});
		response.send(results && results.length ? results[0] : null);
	});

	return router;
};
