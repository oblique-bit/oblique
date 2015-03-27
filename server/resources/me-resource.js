var express = require('express');
var router = express.Router();
var User = require('../models/user');

// API - Me (current user)
// ------------------------------------

module.exports = function (auth) {

	router.get('/', auth.withUser, function (req, res) {
		var id = req.user;
		User.findById(req.user, function (err, user) {
			if (err) {
				// In case of any error, fail fast:
				res.status(500).send(err);
			} else if(!user) {
				// User does not exist, log the error:
				console.log('User not found: [id=%s]', id);
				res.status(401).send({'message': 'User Not found.'});
			} else {
				res.send(user);
			}
		});
	});

	return router;
};
