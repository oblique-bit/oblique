/**
 * Mockgoose is a simplified in memory database that allows you to perform actions
 * on Mongoose Models without having a running instance of MongoDB.
 */
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
var uri = 'mongodb://localhost:27017/oblique-reactive';

// Plugin custom ES6 promise library:
mongoose.Promise = require('q').Promise;

// Export the *wrapped* instance of Mongoose:
mockgoose(mongoose).then(function() {
	mongoose.connect(uri).then(
		function () {
			console.log('[mongoose] Connected to MongoDB: [uri=%s]', uri);
		},
		function (err) {
			console.log('[mongoose] Unable to connect with MongoDB: ', err);
		}
	);
});
module.exports = mongoose;
