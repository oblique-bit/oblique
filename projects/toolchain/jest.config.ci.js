// @ts-check
module.exports = require('./jest.config');
module.exports.reporters = [
	'default',
	[
		'jest-sonar',
		{
			outputDirectory: '../../coverage/toolchain',
			outputName: 'sqr.xml'
		}
	]
];
