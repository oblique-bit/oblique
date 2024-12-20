module.exports = require('./jest.config');
module.exports.reporters = [
	'default',
	[
		'jest-sonar',
		{
			outputDirectory: '../../coverage/cli',
			outputName: 'sqr.xml'
		}
	]
];
