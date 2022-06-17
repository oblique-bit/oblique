'use strict';

module.exports = {
	preset: 'jest-preset-angular',
	setupFilesAfterEnv: ['<rootDir>/tests/setupJest.ts'],
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
