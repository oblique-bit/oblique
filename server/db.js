/**
 * Mockgoose is a simplified in memory database that allows you to perform actions on Mongoose Models without having a running instance of MongoDB.
 */
var mockgoose = require('mockgoose');
var mongoose = require('mongoose');


// Export the *wrapped* instance of Mongoose:
mockgoose(mongoose);
module.exports = mongoose;
