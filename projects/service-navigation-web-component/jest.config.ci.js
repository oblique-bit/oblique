// @ts-check
import baseConfig from './jest.config.js';

export default {
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
