'use strict';

module.exports = require('./jest.config.js');
module.exports.jestSonar = {
	reportPath: './coverage/sonarQube',
	reportFile: 'sqr.xml',
	indent: 4,
	sonar56x: true
};
