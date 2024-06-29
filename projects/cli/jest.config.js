'use strict';

module.exports = {
	displayName: {
		name: 'CLI',
		color: 'blue'
	},
	/*
	 * As this is not an angular app, 'jest-preset-angular' is not used, meaning
	 * the 'transform' property has to be manually set
	 */
	transform: {
		'^.+\\.ts$': 'ts-jest'
	},
	collectCoverage: true,
	coverageDirectory: '../../coverage/cli',
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
