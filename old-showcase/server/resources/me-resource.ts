// API - Me (current user)
// ------------------------------------
module.exports = (auth) => {
	let express = require('express');
	let router = express.Router();
	let User = require('../models/user');

	router.get('/', auth.withUser, (req, res) => {
		User.findByEmail(req.email).then((user) => {
			if(!user) {
				// User does not exist, log the error:
				console.log('User not found:', req.email);
				res.status(401).send({'message': 'User Not found.'});
			} else {
				res.send(user);
			}
		}).catch((error) => {
			// In case of any error, fail fast:
			res.status(500).send(error);
		});
	});

	return router;
};
