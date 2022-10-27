'use strict';

module.exports = require('./jest.config');
module.exports.testResultsProcessor = 'jest-sonar-reporter';
module.exports.reporters = undefined;
module.exports.collectCoverageFrom = [
	'<rootDir>/projects/oblique/src/lib/**/*.ts',
	'!**/_mocks/**',
	'!**/*.module.ts',
	'!**/**.harness.ts',
	// the following files have no spec files and therefore have a 0 coverage. Tests will be written later
	'!**/column-toggle.directive.ts',
	'!**/date-formatter.pipe.ts',
	'!**/datepicker-i18n.service.ts',
	'!**/http-api-interceptor.ts',
	'!**/nested-form.component.ts',
	'!**/off-canvas-backdrop.directive.ts',
	'!**/off-canvas-container.directive.ts',
	'!**/schema-required.directive.ts',
	'!**/spinner.component.ts',
	'!**/unsaved-changes.guard.ts'
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
	},
	// The following rules do apply to all target files individually
	'projects/oblique/src/lib/breadcrumb/*.ts': {
		statements: 98,
		branches: 80,
		functions: 95,
		lines: 98
	},
	'projects/oblique/src/lib/button/*.ts': {
		statements: 100,
		branches: 80,
		functions: 100,
		lines: 100
	},
	'projects/oblique/src/lib/collapse/*.ts': {
		statements: 100,
		branches: 81,
		functions: 100,
		lines: 100
	},
	'projects/oblique/src/lib/column-layout/*.ts': {
		statements: 50,
		branches: 47,
		functions: 0,
		lines: 33
	},
	'projects/oblique/src/lib/datepicker/*.ts': {
		statements: 74,
		branches: 27,
		functions: 80,
		lines: 71
	},
	'projects/oblique/src/lib/document-meta/*.ts': {
		statements: 61,
		branches: 7,
		functions: 18,
		lines: 59
	},
	'projects/oblique/src/lib/dropdown/*.ts': {
		statements: 100,
		branches: 90,
		functions: 100,
		lines: 100
	},
	'projects/oblique/src/lib/error-messages/*.ts': {
		statements: 53,
		branches: 0,
		functions: 11,
		lines: 52
	},
	'projects/oblique/src/lib/external-link/*.ts': {
		statements: 91,
		branches: 92,
		functions: 85,
		lines: 90
	},
	'projects/oblique/src/lib/file-upload/progress/*.ts': {
		statements: 100,
		branches: 95,
		functions: 100,
		lines: 100
	},
	'projects/oblique/src/lib/form-control-state/*.ts': {
		statements: 88,
		branches: 81,
		functions: 88,
		lines: 90
	},
	'projects/oblique/src/lib/http-api-interceptor/*.ts': {
		statements: 28,
		branches: 0,
		functions: 0,
		lines: 21
	},
	'projects/oblique/src/lib/icon/*.ts': {
		statements: 96,
		branches: 75,
		functions: 100,
		lines: 95
	},
	'projects/oblique/src/lib/input-clear/*.ts': {
		statements: 97,
		branches: 91,
		functions: 100,
		lines: 95
	},
	'projects/oblique/src/lib/master-layout/*.ts': {
		statements: 93,
		branches: 66,
		functions: 80,
		lines: 91
	},
	'projects/oblique/src/lib/master-layout/master-layout/*.ts': {
		statements: 87,
		branches: 58,
		functions: 74,
		lines: 86
	},
	'projects/oblique/src/lib/master-layout/master-layout-header/*.ts': {
		statements: 83,
		branches: 65,
		functions: 75,
		lines: 82
	},
	'projects/oblique/src/lib/master-layout/master-layout-navigation/*.ts': {
		statements: 69,
		branches: 53,
		functions: 53,
		lines: 70
	},
	'projects/oblique/src/lib/multi-translate-loader/*.ts': {
		statements: 22,
		branches: 0,
		functions: 0,
		lines: 25
	},
	'projects/oblique/src/lib/multiselect/*.ts': {
		statements: 82,
		branches: 0,
		functions: 70,
		lines: 82
	},
	'projects/oblique/src/lib/nav-tree/*.ts': {
		statements: 91,
		branches: 74,
		functions: 96,
		lines: 91
	},
	'projects/oblique/src/lib/nested-form/*.ts': {
		statements: 69,
		branches: 100,
		functions: 25,
		lines: 63
	},
	'projects/oblique/src/lib/notification/*.ts': {
		statements: 90,
		branches: 78,
		functions: 78,
		lines: 96
	},
	'projects/oblique/src/lib/number-format/*.ts': {
		statements: 83,
		branches: 80,
		functions: 85,
		lines: 81
	},
	'projects/oblique/src/lib/off-canvas/*.ts': {
		statements: 72,
		branches: 100,
		functions: 33,
		lines: 66
	},
	'projects/oblique/src/lib/schema-validation/*.ts': {
		statements: 79,
		branches: 69,
		functions: 75,
		lines: 79
	},
	'projects/oblique/src/lib/scrolling/*.ts': {
		statements: 69,
		branches: 100,
		functions: 0,
		lines: 63
	},
	'projects/oblique/src/lib/search-box/*.ts': {
		statements: 91,
		branches: 85,
		functions: 66,
		lines: 89
	},
	'projects/oblique/src/lib/selectable/*.ts': {
		statements: 100,
		branches: 89,
		functions: 100,
		lines: 100
	},
	'projects/oblique/src/lib/spinner/*.ts': {
		statements: 100,
		branches: 81,
		functions: 100,
		lines: 100
	},
	'projects/oblique/src/lib/sticky/*.ts': {
		statements: 93,
		branches: 85,
		functions: 100,
		lines: 95
	},
	'projects/oblique/src/lib/telemetry/*.ts': {
		statements: 96,
		branches: 92,
		functions: 83,
		lines: 96
	},
	'projects/oblique/src/lib/unsaved-changes-tabs/*.ts': {
		statements: 90,
		branches: 85,
		functions: 75,
		lines: 89
	}
};
