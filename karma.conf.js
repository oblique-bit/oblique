// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
	var options = config.buildWebpack.options;
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-firefox-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage-istanbul-reporter'),
			require('karma-sonarqube-unit-reporter'),
			require('@angular-devkit/build-angular/plugins/karma')
		],
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		reporters: ['progress', 'kjhtml', 'coverage-istanbul', 'sonarqubeUnit'],
		coverageIstanbulReporter: {
			dir: require('path').join(__dirname, './target/coverage'),
			reports: ['html', 'lcovonly'],
			fixWebpackSourcePaths: true
		},
		sonarQubeUnitReporter: {
			sonarQubeVersion: 'LATEST',
			outputFile: './target/sonarQube/sqr.xml',
			testPaths: ['src/lib', 'src/showcase'],
			testFilePattern: '.spec.ts',
			overrideTestDescription: true,
			useBrowserName: false
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_DEBUG,
		browserConsoleLogOptions: {
			level: 'log',
			format: '%b %T: %m',
			terminal: true
		},
		autoWatch: options.watch,
		browsers: options.watch ? ['Firefox'] : ['ChromeHeadlessCustom'],
		customLaunchers: {
			ChromeHeadlessCustom: {
				base: 'ChromeHeadless',
				browserDisconnectTimeout: 10000,
				browserDisconnectTolerance: 3,
				browserNoActivityTimeout: 60000,
				flags: [
					'--no-sandbox', // required to run without privileges in Docker
					'--disable-web-security',
					'--enable-gpu'
				]
			}
		},
		singleRun: !options.watch
	});
};
