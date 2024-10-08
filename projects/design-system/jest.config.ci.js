'use strict';

module.exports = require('./jest.config');
module.exports.reporters = [
	'default',
	[
		'jest-sonar',
		{
			outputDirectory: '<rootDir>/coverage/design-system',
			outputName: 'sqr.xml'
		}
	]
];
