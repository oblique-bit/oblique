'use strict';

module.exports = {
	preset: 'jest-preset-angular',
	roots: ['<rootDir>/src'],
	setupTestFrameworkScriptFile: '<rootDir>/tests/setupJest.ts',
	moduleNameMapper: {
		'oblique-reactive': '<rootDir>projects/oblique-reactive/src/public_api.ts',
		'tests': '<rootDir>/test_helpers'
	},
	globals: {
		'ts-jest': {
			diagnostics: false
		}
	},
	coverageDirectory: './coverage/sonarQube',
	testResultsProcessor: 'jest-sonar-reporter',
	collectCoverage: true,
	coveragePathIgnorePatterns : ['node_modules', '/tests/']
};
