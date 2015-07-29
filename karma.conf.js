// Karma configuration
var _ = require('lodash');
var grunt = require('grunt');

// Require project configuration:
var project = grunt.file.readJSON('project.json');

module.exports = function (config) {

    var karmaResources = [];

    _.forEach(project.common.resources.vendor.js, function (v) {
        karmaResources.push('vendor/' + v);
    });
    _.forEach(project.common.resources.app, function (v) {
        karmaResources.push('src/' + v);
    });

    karmaResources.push('vendor/angular-mocks/angular-mocks.js');
    karmaResources.push('src/**/*.spec.js');

    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: karmaResources,

        // list of files to exclude
        exclude: [
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'junit', 'coverage'],

        junitReporter: {
            outputFile: 'target/surefire-reports/TEST-karma-results.xml'
        },

        coverageReporter: {
            type: 'lcovonly',
            dir: 'target/coverage-reports/'
        },

        preprocessors: {
            'src/app/**/*.js': ['coverage']
        },

        // web server port
        port: 9877,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera (has to be installed with `npm install karma-opera-launcher`)
        // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
        // - PhantomJS
        // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
