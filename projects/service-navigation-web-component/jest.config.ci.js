// @ts-check
const baseConfig = require('./jest.config');

module.exports = {
	...baseConfig,
	reporters: [
		'default',
		[
			'jest-sonar',
			{
				outputDirectory: '<rootDir>/coverage/service-navigation-web-component',
				outputName: 'sqr.xml',
			},
		],
	],
};
