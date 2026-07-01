// @ts-check
import coverageConfig from '../../tests/jest.config.coverage.js';
export default {
	displayName: {
		name: 'Toolchain',
		color: 'cyan',
	},
	preset: 'ts-jest',
	testEnvironment: 'node',
	/*
	 * As this is not an angular app, 'jest-preset-angular' is not used, meaning
	 * the 'transform' property has to be manually set
	 */
	transform: {
		'^.+\\.ts$': ['ts-jest', {tsconfig: '<rootDir>/tsconfig.spec.json'}],
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
		'^(ora)$': '<rootDir>/__mocks__/ora.js',
		'^(magic-string)$': '<rootDir>/__mocks__/magic-string.js',
	},
	...coverageConfig,
	coverageDirectory: '../../coverage/toolchain',
	collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts', '!src/**/mock/*', '!src/schematics/test-utils.ts'],
};
