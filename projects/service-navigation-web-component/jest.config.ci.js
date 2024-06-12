'use strict';

module.exports = require('./jest.config');
module.exports.reporters[1][1].outputDirectory = '<rootDir>/coverage/service-navigation-web-component';
