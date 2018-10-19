// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
	var options = config.buildWebpack.options;
	config.set({
		basePath: '',
		frameworks: ['parallel', 'jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-parallel'),
			require('karma-chrome-launcher'),
			require('karma-firefox-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage-istanbul-reporter'),
			require('karma-sonarqube-unit-reporter'),
			require('@angular-devkit/build-angular/plugins/karma')
		],
		parallelOptions: {
			executors: (Math.ceil(require('os').cpus().length / 2)),
			shardStrategy: 'round-robin'
		},
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		reporters: options.codeCoverage
			? ['coverage-istanbul', 'sonarqubeUnit']
			: ['kjhtml', 'progress'],
		coverageIstanbulReporter: {
			dir: require('path').join(__dirname, '../../coverage'),
			reports: ['html', 'lcovonly'],
			fixWebpackSourcePaths: true
		},
		sonarQubeUnitReporter: {
			sonarQubeVersion: 'LATEST',
			outputFile: '../../coverage/sonarQube/sqr.xml',
			testPaths: [ './projects/oblique-reactive/src/lib'],
			testFilePattern: '.spec.ts',
			overrideTestDescription: true,
			useBrowserName: false
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		browserConsoleLogOptions: {
			level: 'log',
			format: '%b %T: %m',
			terminal: true
		},
		autoWatch: options.watch,
		singleRun: !options.watch,
		browsers: options.browsers.split(','),
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
		}
	});
};
