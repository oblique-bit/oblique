'use strict';

module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
	moduleNameMapper: {
		'oblique': '<rootDir>projects/oblique/src/public_api.ts'
	},
	globals: {
		'ts-jest': {
			diagnostics: false
		}
	},
	coverageDirectory: '<rootDir>/coverage/sonarQube',
	testResultsProcessor: 'jest-sonar-reporter',
	collectCoverage: true,
	forceCoverageMatch: [
		'**/projects/oblique/src/lib/**/*.ts',
		'**/projects/oblique/src/lib/**/*.html'
	],
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
};
