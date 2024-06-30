'use strict';

module.exports = require('../../tests/jest.config');
module.exports.roots = ['<rootDir>/projects/sandbox-ssr'];
module.exports.displayName = {
	name: 'Sandbox-SSR',
	color: 'greenBright'
};
module.exports.moduleNameMapper = {
	'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
	'@oblique/design-system': '<rootDir>/projects/design-system/src/public-api'
};
module.exports.coverageDirectory = '<rootDir>/coverage/sandbox-ssr';
module.exports.coveragePathIgnorePatterns = ['<rootDir>/projects/oblique'];
module.exports.collectCoverageFrom = [
	'<rootDir>/projects/sandbox-ssr/src/app/**/*.ts',
	'!**/app.config.server.ts',
	'!**/app.config.ts',
	'!**/*.routes.ts'
];
module.exports.coverageThreshold = {
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
};
