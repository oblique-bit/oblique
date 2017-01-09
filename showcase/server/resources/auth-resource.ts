// API - Auth
// ------------------------------------
module.exports = (auth) => {

	let router = require('express').Router();
	let User = require('../models/user');

	router.post('/register', (req, res, next) => {
		let email = req.body.email;
		User.findByEmail(email).then((user) => {
			if (user) {
				// User already exists:
				console.log('User already exists with email: %s', email);
				res.status(409).send({'message': 'User already exists!'});
			} else {
				// Create new user:
				let model = new User({
					email: email,
					password: auth.createHash(req.body.password),
					firstname: req.body.firstname,
					lastname: req.body.lastname,
					roles: ['member']
				});
				User.create(model).then((user) => {
					console.log('User registration successful!');
					res.status(201).send({ token: auth.createToken(user) });
				}).catch((error) => {
					console.log('Error saving user: %s', error);
					res.status(500).send(error);
					throw error;
				});
			}
		}).catch((error) => {
			console.log('Error in signup: ', error);
			res.status(500).send(error);
		});
	});

	router.post('/login', (req, res, next) => {
		console.log('Logging in user: [credentials=%s]', req.body);
		let email = req.body.email;
		let password = req.body.password;

		User.findByEmail(email).then(
			(user) => {
				if(!user) {
					// Email does not exist, log the error:
					console.log('User not found: [email=%s]', email);
					res.status(401).send({'message': 'User Not found.'});
				} else if (!auth.isValidPassword(user, password)) {
					// User exists but wrong password, log the error:
					console.log('Invalid Password');
					res.status(401).send({'message': 'Invalid Password'});
				} else {
					// User exists:
					console.log('User found:', email);
					res.send({ token: auth.createToken(user) });
				}
			}
		).catch((error) => {
			// In case of any error, fail fast:
			res.status(500).send(error);
		});
	});

	router.post('/logout', (req, res) => {
		// TODO: something else?
		res.send();
	});

	return router;
};


