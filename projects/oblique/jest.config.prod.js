'use strict';

module.exports = require('./jest.config');
module.exports.testResultsProcessor = 'jest-sonar-reporter';
module.exports.reporters = undefined;
