// Auth - Middleware
// ------------------------------------
module.exports = (config) => {
	let jwt = require('jwt-simple');
	let moment = require('moment');
	let bCrypt = require('bcrypt-nodejs');

	return {
		withUser: (req, res, next) => {
			if (!req.headers.authorization) {
				return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
			}
			let token = req.headers.authorization.split(' ')[1];
			let payload = jwt.decode(token, config.auth.secret);
			if (payload.exp <= moment().unix()) {
				return res.status(401).send({message: 'Token has expired'});
			}

			// Store user on request:
			req.email = payload.email;

			// Continue:
			next();
		},

		// Generates a JSON Web Token:
		createToken: (user) => {
			let payload = {
				email: user.email,
				iat: moment().unix(),
				exp: moment().add(14, 'days').unix()
			};
			return jwt.encode(payload, config.auth.secret);
		},

		isValidPassword: (user, password) => {
			return bCrypt.compareSync(password, user.password);
		},

		// Generates hash using bCrypt
		createHash: (password) => {
			return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
		}
	};
};
