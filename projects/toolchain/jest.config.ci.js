// @ts-check
import baseConfig from './jest.config.js';

export default {
	...baseConfig,
	reporters: [
		'default',
		[
			'jest-sonar',
			{
				outputDirectory: '../../coverage/toolchain',
				outputName: 'sqr.xml',
			},
		],
	],
};
