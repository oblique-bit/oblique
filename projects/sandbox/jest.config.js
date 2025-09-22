// @ts-check
const baseConfig = require('../../tests/jest.config');

module.exports = {
	...baseConfig,
	roots: ['<rootDir>/projects/sandbox'],
	displayName: {
		name: 'Sandbox',
		color: 'cyan'
	},
	moduleNameMapper: {
		'@oblique/oblique': '<rootDir>/projects/oblique/src/public_api.ts',
		'@oblique/version': '<rootDir>/projects/oblique/src/lib/version.ts'
	},
	coverageDirectory: '<rootDir>/coverage/sandbox',
	coveragePathIgnorePatterns: ['<rootDir>/projects/oblique'],
	coverageThreshold: {
		...baseConfig.coverageThreshold,
		'projects/sandbox/src/app/app.component.ts': {
			statements: 75,
			branches: 100,
			functions: 50,
			lines: 78
		},
		'projects/sandbox/src/app/samples/master-layout/dynamic-navigation.service.ts': {
			statements: 64,
			branches: 100,
			functions: 50,
			lines: 61
		},
		'projects/sandbox/src/app/samples/nav-tree/*.ts': {
			statements: 80,
			branches: 100,
			functions: 40,
			lines: 83
		},
		'projects/sandbox/src/app/samples/number-format/*.ts': {
			statements: 81,
			branches: 100,
			functions: 33,
			lines: 77
		},
		'projects/sandbox/src/app/samples/schema-validation/*.ts': {
			statements: 84,
			branches: 12,
			functions: 75,
			lines: 82
		}
	}
};
