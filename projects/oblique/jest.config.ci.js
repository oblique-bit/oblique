// @ts-check
module.exports = require('./jest.config');
module.exports.reporters = [
	'default',
	[
		'jest-sonar',
		{
			outputDirectory: '<rootDir>/coverage/oblique',
			outputName: 'sqr.xml'
		}
	]
];
