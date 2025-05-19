// @ts-check
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
		},
		'src/new/ob-new.ts': {
			statements: 96,
			branches: 100,
			functions: 100,
			lines: 96
		},
		'src/update/ob-update.ts': {
			statements: 87,
			branches: 83,
			functions: 100,
			lines: 87
		}
	}
};
