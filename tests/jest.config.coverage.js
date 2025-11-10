//@ts-check
module.exports = {
	collectCoverage: true,
	coverageThreshold: {
		/*
		 * "global" combines all files that are not covered by another rules. The thresholds do not apply per file but globally.
		 * This means the global coverage might be sufficient even if a specific file has too weak a coverage.
		 */
		global: {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100,
		},
	},
};
