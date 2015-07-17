/**
 * Mockgoose is a simplified in memory database that allows you to perform actions on Mongoose Models without having a running instance of MongoDB.
 */
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

// Export the *wrapped* instance of Mongoose:
mockgoose(mongoose);
mongoose.connect('mongodb://localhost/oblique-reactive');
module.exports = mongoose;
