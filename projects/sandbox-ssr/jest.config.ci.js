// @ts-check
import baseConfig from './jest.config.js';

export default {
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
