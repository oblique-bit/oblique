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
		'!**/off-canvas-container.directive.ts',
	],
	coverageThreshold: {
		...baseConfig.coverageThreshold,
		'projects/oblique/src/lib/language/language.service.ts': {
			branches: 95,
		},
		'projects/oblique/src/lib/nav-tree/*.ts': {
			statements: 91,
			branches: 70,
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
			branches: 76,
			functions: 85,
			lines: 81,
		},
		'projects/oblique/src/lib/off-canvas/*.ts': {
			statements: 70,
			branches: 77,
			functions: 33,
			lines: 66,
		},
		'projects/oblique/src/lib/popover/popover.directive.ts': {
			branches: 98,
		},
		'projects/oblique/src/lib/schema-validation/*.ts': {
			statements: 92,
			branches: 66,
			functions: 75,
			lines: 100,
		},
		'projects/oblique/src/lib/selectable/selectable-group.directive.ts': {
			branches: 96,
		},
	},
};
