'use strict';

module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
	moduleNameMapper: {
		'oblique': '<rootDir>projects/oblique/src/public_api.ts'
	},
	globals: {
		'ts-jest': {
			diagnostics: {
				pathRegex: /\.(spec|test)\.ts$/
			}
		}
	},
	coveragePathIgnorePatterns: [
		"jestGlobalMocks.ts"
	],

	coverageDirectory: '<rootDir>/coverage/sonarQube',
	testResultsProcessor: 'jest-sonar-reporter',
	collectCoverage: true
};
