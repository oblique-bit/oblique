// @ts-check
import coverageConfig from '../../tests/jest.config.coverage.js';
export default {
	displayName: {
		name: 'CLI',
		color: 'cyan',
	},
	/*
	 * As this is not an angular app, 'jest-preset-angular' is not used, meaning
	 * the 'transform' property has to be manually set
	 */
	transform: {
		'^.+\\.ts$': ['ts-jest', {tsconfig: '<rootDir>/tsconfig.spec.json'}],
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	...coverageConfig,
	coverageDirectory: '../../coverage/cli',
	coverageThreshold: {
		...coverageConfig.coverageThreshold,
		'src/new/ob-new.ts': {
			statements: 95,
			branches: 100,
			functions: 100,
			lines: 95,
		},
		'src/update/ob-update.ts': {
			statements: 87,
			branches: 68,
			functions: 100,
			lines: 87,
		},
	},
};
