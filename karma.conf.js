var _ = require('lodash');

// Project configuration:
var project = require('./project.conf.ts');

module.exports = function (config) {

	// Define base path as the UI directory on target:
	var base = project.build.target + 'ui/';

	// Prepare resources for karma:
	var karmaResources = [];

	_.forEach(project.resources.vendor.js, function (v) {
		karmaResources.push('vendor/' + v);
	});

	_.forEach(project.resources.vendor.dev, function (v) {
		karmaResources.push('vendor/' + v);
	});

	_.forEach(project.resources.app, function (v) {
		karmaResources.push(v);
	});

	// Add the compiled TypeScript files to the karma files, but doesn't load
	// them in the browser, making them available for SystemJS:
	karmaResources.push({pattern: 'app/**/*.js', included: false, watched: false});
	karmaResources.push({
		pattern: 'vendor/oblique-reactive/**/*.js',
		included: false,
		watched: false
	});

	// Add Angular mocking framework:
	karmaResources.push('../../node_modules/angular-mocks/angular-mocks.js');

	// Add the main test file which import all TypeScript resources:
	karmaResources.push('../../test.main.js');

	karmaConfig = {

		// Base path used to resolve and exclude resources:
		basePath: base,

		// frameworks to use
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: karmaResources,

		// list of files to exclude
		exclude: [
			'app/system.config.dev.js'
		],

		plugins: [
			'karma-jasmine',
			'karma-coverage',
			'karma-phantomjs-launcher',
			'karma-junit-reporter'
		],

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['progress', 'junit', 'coverage'],

		junitReporter: {
			outputFile: '../target/surefire-reports/TEST-karma-results.xml'
		},

		coverageReporter: {
			dir: base,
			type: 'lcovonly',
			subdir: '.'
		},

		//preprocessors is defined after config (see bottom of this file)
		preprocessors: {},

		// web server port
		port: 9999,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_WARN,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera (has to be installed with `npm install karma-opera-launcher`)
		// - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
		// - PhantomJS
		// - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
		browsers: ['PhantomJS'],

		// How long will Karma wait for a message from a browser before disconnecting from it (in ms).
		browserNoActivityTimeout: 600000,

		retryLimit: 0,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true
	};
	karmaConfig.preprocessors['app/**/*.js'] = 'coverage';

	config.set(karmaConfig);
};