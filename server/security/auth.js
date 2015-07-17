var jwt = require('jwt-simple');
var moment = require('moment');
var bCrypt = require('bcrypt-nodejs');

// Auth - Middleware
// ------------------------------------
module.exports = function (config) {
	return {
		withUser: function (req, res, next) {
			if (!req.headers.authorization) {
				return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
			}
			var token = req.headers.authorization.split(' ')[1];
			var payload = jwt.decode(token, config.auth.secret);
			if (payload.exp <= moment().unix()) {
				return res.status(401).send({message: 'Token has expired'});
			}

			// Store user on request:
			req.user = payload.user;

			// Continue:
			next();
		},

		// Generates a JSON Web Token:
		createToken: function (user) {
			var payload = {
				user: user._id,
				iat: moment().unix(),
				exp: moment().add(14, 'days').unix()
			};
			return jwt.encode(payload, config.auth.secret);
		},

		isValidPassword: function (user, password) {
			return bCrypt.compareSync(password, user.password);
		},

		// Generates hash using bCrypt
		createHash: function (password) {
			return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
		}
	};
}
