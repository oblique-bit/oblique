// @ts-check
const coverageConfig = require('../../tests/jest.config.coverage');
module.exports = {
	displayName: {
		name: 'Toolchain',
		color: 'cyan'
	},
	preset: 'ts-jest',
	testEnvironment: 'node',
	/*
	 * As this is not an angular app, 'jest-preset-angular' is not used, meaning
	 * the 'transform' property has to be manually set
	 */
	transform: {
		'^.+\\.ts$': 'ts-jest'
	},
	...coverageConfig,
	coverageDirectory: '../../coverage/toolchain',
	collectCoverageFrom: ['src/**/*.ts', '!src/schematics/test-utils.ts']
};
