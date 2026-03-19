// @ts-check
import baseConfig from './jest.config.js';

export default {
	...baseConfig,
	reporters: [
		'default',
		[
			'jest-sonar',
			{
				outputDirectory: '../../coverage/cli',
				outputName: 'sqr.xml',
			},
		],
	],
};
