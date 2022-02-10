'use strict';

module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
	moduleNameMapper: {
		'@oblique/oblique': '<rootDir>projects/oblique/src/public_api.ts'
	},
	globals: {
		'ts-jest': {
			diagnostics: {
				pathRegex: /\.(?:spec|test)\.ts$/
			}
		}
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
	]
};
