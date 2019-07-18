'use strict';

module.exports = {
	preset: 'jest-preset-angular',
	roots: ['<rootDir>/src'],
	setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
	moduleNameMapper: {
		'oblique': '<rootDir>projects/oblique/src/public_api.ts',
		'tests': '<rootDir>/test_helpers'
	},
	globals: {
		'ts-jest': {
			diagnostics: false
		}
	},
	coverageDirectory: '<rootDir>/coverage/sonarQube',
	testResultsProcessor: 'jest-sonar-reporter',
	collectCoverage: true,
	coveragePathIgnorePatterns : ['node_modules', '/tests/', 'test_helpers']
};
