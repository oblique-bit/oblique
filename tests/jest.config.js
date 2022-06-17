/* eslint-disable max-lines */
'use strict';

module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
	moduleNameMapper: {
		'@oblique/oblique': '<rootDir>projects/oblique/src/public_api.ts'
	},
	coveragePathIgnorePatterns: ['jestGlobalMocks.ts', '_mocks', 'assets'],
	coverageDirectory: '<rootDir>/coverage/sonarQube',
	testResultsProcessor: 'jest-sonar-reporter',
	collectCoverage: true,
	reporters: [
		'default',
		[
			'jest-html-reporters',
			{
				publicPath: './jest-report',
				outputPath: './jest-report',
				filename: 'jest-reporter.html',
				pageTitle: 'Oblique',
				expand: false,
				openReport: true,
				failureMessageOnly: false,
				includeConsoleLog: true
			}
		]
	],
	coverageThreshold: {
		/*
		 * "global" combines all files that are not covered by another rules. The thresholds do do apply per file but globally.
		 * This means the global coverage might be sufficient even if a specific file has too weak a coverage.
		 * It is unclear which files are targeted by the global scope, as all covered files have a special rule, the remaining should be 100%
		 */
		global: {
			statements: 93.65,
			branches: 100,
			functions: 73.33,
			lines: 92.72
		},
		// The following rules do apply to all target files individually
		'projects/oblique/src/lib/alert/*.ts': {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100
		},
		'projects/oblique/src/lib/breadcrumb/*.ts': {
			statements: 98,
			branches: 80,
			functions: 95,
			lines: 97
		},
		'projects/oblique/src/lib/button/*.ts': {
			statements: 100,
			branches: 80,
			functions: 100,
			lines: 100
		},
		'projects/oblique/src/lib/collapse/*.ts': {
			statements: 100,
			branches: 80,
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
			statements: 71,
			branches: 27,
			functions: 34,
			lines: 68
		},
		'projects/oblique/src/lib/document-meta/*.ts': {
			statements: 61,
			branches: 6,
			functions: 18,
			lines: 59
		},
		'projects/oblique/src/lib/dropdown/*.ts': {
			statements: 94,
			branches: 90,
			functions: 60,
			lines: 92
		},
		'projects/oblique/src/lib/error-messages/*.ts': {
			statements: 53,
			branches: 0,
			functions: 11,
			lines: 50
		},
		'projects/oblique/src/lib/external-link/*.ts': {
			statements: 90,
			branches: 92,
			functions: 83,
			lines: 89
		},
		'projects/oblique/src/lib/file-upload/*.ts': {
			statements: 93,
			branches: 97,
			functions: 75,
			lines: 75
		},
		'projects/oblique/src/lib/file-upload/drop-zone/*.ts': {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100
		},
		'projects/oblique/src/lib/file-upload/file-info/*.ts': {
			statements: 94.73,
			branches: 92.3,
			functions: 86.36,
			lines: 95.65
		},
		'projects/oblique/src/lib/file-upload/progress/*.ts': {
			statements: 95.65,
			branches: 95.65,
			functions: 100,
			lines: 100
		},
		'projects/oblique/src/lib/form-control-state/*.ts': {
			statements: 88,
			branches: 81,
			functions: 66,
			lines: 66
		},
		'projects/oblique/src/lib/global-events/*.ts': {
			statements: 96,
			branches: 100,
			functions: 83,
			lines: 96
		},
		'projects/oblique/src/lib/http-api-interceptor/*.ts': {
			statements: 28,
			branches: 0,
			functions: 0,
			lines: 5
		},
		'projects/oblique/src/lib/icon/*.ts': {
			statements: 96,
			branches: 50,
			functions: 42,
			lines: 63
		},
		'projects/oblique/src/lib/input-clear/*.ts': {
			statements: 92,
			branches: 91,
			functions: 71,
			lines: 90
		},
		'projects/oblique/src/lib/language/*.ts': {
			statements: 97,
			branches: 95,
			functions: 75,
			lines: 96
		},
		'projects/oblique/src/lib/master-layout/*.ts': {
			statements: 81,
			branches: 50,
			functions: 50,
			lines: 79
		},
		'projects/oblique/src/lib/master-layout/master-layout/*.ts': {
			statements: 87.7,
			branches: 57.14,
			functions: 75.43,
			lines: 87.17
		},
		'projects/oblique/src/lib/master-layout/master-layout-footer/*.ts': {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100
		},
		'projects/oblique/src/lib/master-layout/master-layout-header/*.ts': {
			statements: 80.88,
			branches: 38.46,
			functions: 74.07,
			lines: 80
		},
		'projects/oblique/src/lib/master-layout/master-layout-navigation/*.ts': {
			statements: 28.57,
			branches: 0,
			functions: 0,
			lines: 21.05
		},
		'projects/oblique/src/lib/multi-translate-loader/*.ts': {
			statements: 22,
			branches: 0,
			functions: 0,
			lines: 25
		},
		'projects/oblique/src/lib/multiselect/*.ts': {
			statements: 77,
			branches: 0,
			functions: 43,
			lines: 74
		},
		'projects/oblique/src/lib/nav-tree/*.ts': {
			statements: 91,
			branches: 77,
			functions: 72,
			lines: 91
		},
		'projects/oblique/src/lib/nested-form/*.ts': {
			statements: 67,
			branches: 0,
			functions: 3,
			lines: 61
		},
		'projects/oblique/src/lib/notification/*.ts': {
			statements: 90,
			branches: 78,
			functions: 60,
			lines: 93
		},
		'projects/oblique/src/lib/number-format/*.ts': {
			statements: 81,
			branches: 77,
			functions: 50,
			lines: 80
		},
		'projects/oblique/src/lib/off-canvas/*.ts': {
			statements: 75,
			branches: 75,
			functions: 21,
			lines: 70
		},
		'projects/oblique/src/lib/pop-up/*.ts': {
			statements: 95,
			branches: 100,
			functions: 62,
			lines: 93
		},
		'projects/oblique/src/lib/popover/*.ts': {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100
		},
		'projects/oblique/src/lib/schema-validation/*.ts': {
			statements: 79,
			branches: 62,
			functions: 59,
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
			statements: 96,
			branches: 85,
			functions: 71,
			lines: 95
		},
		'projects/oblique/src/lib/spinner/*.ts': {
			statements: 75,
			branches: 69,
			functions: 38,
			lines: 72
		},
		'projects/oblique/src/lib/sticky/*.ts': {
			statements: 93,
			branches: 85,
			functions: 66,
			lines: 91
		},
		'projects/oblique/src/lib/telemetry/*.ts': {
			statements: 92,
			branches: 82,
			functions: 66,
			lines: 95
		},
		'projects/oblique/src/lib/translate-params/*.ts': {
			statements: 91,
			branches: 82,
			functions: 0,
			lines: 88
		},
		'projects/oblique/src/lib/unknown-route/*.ts': {
			statements: 92,
			branches: 82,
			functions: 66,
			lines: 95
		},
		'projects/oblique/src/lib/unsaved-changes/*.ts': {
			statements: 75,
			branches: 82,
			functions: 66,
			lines: 78
		},
		'projects/oblique/src/lib/unsaved-changes-tabs/*.ts': {
			statements: 90,
			branches: 82,
			functions: 66,
			lines: 89
		},
		'projects/oblique/src/lib/*.ts': {
			statements: 80,
			branches: 15,
			functions: 36,
			lines: 80
		}
	}
};
