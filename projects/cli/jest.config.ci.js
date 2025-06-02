// @ts-check
const baseConfig = require('./jest.config');

module.exports = {
	...baseConfig,
	reporters: [
		'default',
		[
			'jest-sonar',
			{
				outputDirectory: '../../coverage/cli',
				outputName: 'sqr.xml'
			}
		]
	]
};
