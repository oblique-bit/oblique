module.exports = require('./jest.config');
module.exports.reporters = [
	'default',
	[
		'jest-sonar',
		{
			outputDirectory: '<rootDir>/coverage/service-navigation-web-component',
			outputName: 'sqr.xml'
		}
	]
];
