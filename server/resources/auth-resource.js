var router = require('express').Router();
var request = require('request');
var moment = require('moment');
var User = require('../models/user');

// API - Auth
// ------------------------------------
module.exports = function(auth) {

	router.post('/register', function(req, res, next) {
		var email = req.body.email;
		User.findOne({'email': email}, function (err, user) {
			// In case of any error, return using the done method
			if (err) {
				console.log('Error in signup: %s', err);
				res.status(500).send(err);
			}else if (user) {
				// User already exists:
				console.log('User already exists with email: %s', email);
				res.status(409).send({'message': 'User already exists!'});
			} else {
				// Create new user:
				var model = new User();
				model.email = email;
				model.password = auth.createHash(req.body.password);
				model.firstname = req.body.firstname;
				model.lastname = req.body.lastname;
				model.roles = ['member'];

				// save the user
				model.save(function (err) {
					if (err) {
						console.log('Error saving user: %s', err);
						throw err;
						res.status(500).send(info);
					} else {
						console.log('User registration successful!');
						res.status(201).send({ token: auth.createToken(model) });
					}
				});
			}
		});
	});

	router.post('/login', function(req, res, next) {
		console.log('Logging in user: [credentials=%s]', req.body);
		var email = req.body.email;
		var password = req.body.password;

		User.findOne({'email': email},
			function (err, user) {
				if (err) {
					// In case of any error, fail fast:
					res.status(500).send(err);
				} else if(!user) {
					// Email does not exist, log the error:
					console.log('User not found: [email=%s]', email);
					res.status(401).send({'message': 'User Not found.'});
				} else if (!auth.isValidPassword(user, password)) {
					// User exists but wrong password, log the error:
					console.log('Invalid Password');
					res.status(401).send({'message': 'Invalid Password'});
				} else {
					// User and password both match, return user from done method
					// which will be treated like success
					res.send({ token: auth.createToken(user) });
				}
			}
		);
	});

	router.post('/logout', function(req, res) {
		// TODO: something else?
		res.send();
	});

	return router;
};


