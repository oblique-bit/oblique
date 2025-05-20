// @ts-check
module.exports = {
	displayName: {
		name: 'Toolchain',
		color: 'purple'
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
	collectCoverage: true,
	coverageDirectory: '../../coverage/toolchain',
	collectCoverageFrom: ['src/**/*.ts'],
	coverageThreshold: {
		/*
		 * "global" combines all files that are not covered by another rules. The thresholds do not apply per file but globally.
		 * This means the global coverage might be sufficient even if a specific file has too weak a coverage.
		 */
		global: {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100
		}
	}
};
