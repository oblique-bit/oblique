// @ts-check
const baseConfig = require('./jest.config');

module.exports = {
	...baseConfig,
	reporters: [
		'default',
		[
			'jest-sonar',
			{
				outputDirectory: '<rootDir>/coverage/sandbox-ssr',
				outputName: 'sqr.xml',
			},
		],
	],
};
