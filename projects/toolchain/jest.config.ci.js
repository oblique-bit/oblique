// @ts-check
const baseConfig = require('./jest.config');

module.exports = {
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
