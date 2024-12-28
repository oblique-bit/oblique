module.exports = require('./jest.config');
module.exports.reporters = [
	'default',
	[
		'jest-sonar',
		{
			outputDirectory: '<rootDir>/coverage/sandbox',
			outputName: 'sqr.xml'
		}
	]
];
