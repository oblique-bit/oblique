// @ts-check
const baseConfig = require('./jest.config');

module.exports = {
	...baseConfig,
	reporters: [
		'default',
		[
			'jest-sonar',
			{
				outputDirectory: '<rootDir>/coverage/sds',
				outputName: 'sqr.xml'
			}
		]
	]
};
