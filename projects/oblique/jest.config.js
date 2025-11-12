// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/oblique'],
	displayName: {
		name: 'Oblique',
		color: 'cyan',
	},
	coverageDirectory: '<rootDir>/coverage/oblique',
	collectCoverageFrom: [
		'<rootDir>/projects/oblique/src/lib/**/*.ts',
		'!**/_mocks/**',
		'!**/*.module.ts',
		'!**/**.harness.ts',
		'!**/index.ts',
		// the following files have no spec files and therefore have a 0 coverage. Tests will be written later
		'!**/http-api-interceptor.ts',
		'!**/off-canvas-container.directive.ts',
	],
	coverageThreshold: {
		...baseConfig.coverageThreshold,
		'projects/oblique/src/lib/breadcrumb/*.ts': {
			statements: 98,
			branches: 78,
			functions: 95,
			lines: 97,
		},
		'projects/oblique/src/lib/button/*.ts': {
			statements: 100,
			branches: 76,
			functions: 100,
			lines: 100,
		},
		'projects/oblique/src/lib/column-layout/column-layout.component.ts': {
			branches: 94,
		},
		'projects/oblique/src/lib/document-meta/*.ts': {
			statements: 59,
			branches: 7,
			functions: 18,
			lines: 58,
		},
		'projects/oblique/src/lib/error-messages/*.ts': {
			statements: 52,
			branches: 0,
			functions: 11,
			lines: 52,
		},
		'projects/oblique/src/lib/file-upload/progress/*.ts': {
			statements: 100,
			branches: 88,
			functions: 100,
			lines: 100,
		},
		'projects/oblique/src/lib/http-api-interceptor/*.ts': {
			statements: 0,
			branches: 0,
			functions: 0,
			lines: 0,
		},
		'projects/oblique/src/lib/icon/*.ts': {
			statements: 96,
			branches: 75,
			functions: 100,
			lines: 95,
		},
		'projects/oblique/src/lib/input-clear/*.ts': {
			statements: 96,
			branches: 85,
			functions: 100,
			lines: 95,
		},
		'projects/oblique/src/lib/master-layout/*.ts': {
			statements: 93,
			branches: 66,
			functions: 80,
			lines: 91,
		},
		'projects/oblique/src/lib/master-layout/master-layout/*.ts': {
			statements: 96,
			branches: 92,
			functions: 93,
			lines: 96,
		},
		'projects/oblique/src/lib/master-layout/master-layout-navigation/*.ts': {
			statements: 84,
			branches: 67,
			functions: 79,
			lines: 84,
		},
		'projects/oblique/src/lib/master-layout/master-layout-navigation/sub-menu-item/*.ts': {
			statements: 80,
			branches: 88,
			functions: 90,
			lines: 80,
		},
		'projects/oblique/src/lib/multi-translate-loader/*.ts': {
			statements: 22,
			branches: 0,
			functions: 0,
			lines: 25,
		},
		'projects/oblique/src/lib/nav-tree/*.ts': {
			statements: 91,
			branches: 72,
			functions: 96,
			lines: 91,
		},
		'projects/oblique/src/lib/nested-form/*.ts': {
			statements: 66,
			branches: 90,
			functions: 25,
			lines: 63,
		},
		'projects/oblique/src/lib/notification/*.ts': {
			statements: 90,
			branches: 77,
			functions: 78,
			lines: 89,
		},
		'projects/oblique/src/lib/number-format/*.ts': {
			statements: 82,
			branches: 77,
			functions: 85,
			lines: 81,
		},
		'projects/oblique/src/lib/off-canvas/*.ts': {
			statements: 70,
			branches: 77,
			functions: 33,
			lines: 66,
		},
		'projects/oblique/src/lib/schema-validation/*.ts': {
			statements: 92,
			branches: 80,
			functions: 75,
			lines: 100,
		},
		'projects/oblique/src/lib/scrolling/*.ts': {
			statements: 33,
			branches: 83,
			functions: 0,
			lines: 27,
		},
	},
};
