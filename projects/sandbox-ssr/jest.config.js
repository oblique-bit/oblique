// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/sandbox-ssr'],
	displayName: {
		name: 'Sandbox-SSR',
		color: 'greenBright'
	},
	moduleNameMapper: {
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
		'@oblique/design-system': '<rootDir>/projects/design-system/src/public-api'
	},
	coverageDirectory: '<rootDir>/coverage/sandbox-ssr',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique'],
	collectCoverageFrom: [
		'<rootDir>/projects/sandbox-ssr/src/app/**/*.ts',
		'!**/multi-translate-loader*',
		'!**/app.config.server.ts',
		'!**/app.config.ts',
		'!**/*.routes.ts'
	],
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
