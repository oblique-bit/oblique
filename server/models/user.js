var db = require('../db.js');
var Schema = db.Schema;

module.exports = db.model('User', {
	email: String,
	password: String,
	firstname: String,
	lastname: String,
	picture: String
});
