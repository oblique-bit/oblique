/*
 * Loads all compiled TypeScript files for the tests.
 * After that, it will load all *.spec.ts files, to run the tests.
 * Finally, it starts karma.
 */

// Turn on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function () {
};

// Load SystemJS configuration:
SystemJS.config({
	baseURL: '/base/',
	defaultJSExtensions: true,
	map: {
		'oblique-reactive': 'vendor/oblique-reactive'
	}
});

Promise.all([
	SystemJS.import('app/app-config'),
	SystemJS.import('app/app-module')
]).then(function () {
	return Promise.all(
		Object.keys(window.__karma__.files) // All files served by Karma.
			.filter(onlySpecFiles)
			.map(file2moduleName)
			.map(function (path) {
				return SystemJS.import(path);
			})
	);
}).then(function () {
	__karma__.start();
}, function (error) {
	console.error(error.stack || error);
	__karma__.start();
});

function onlySpecFiles(path) {
	// check for individual files, if not given, always matches to all
	var patternMatched = __karma__.config.files ?
		path.match(new RegExp(__karma__.config.files)) : true;

	return patternMatched && /[\.|_]spec\.js$/.test(path);
}

// Normalize paths to module names.
function file2moduleName(filePath) {
	return filePath.replace(/\\/g, '/')
		.replace(/^\/base\//, '')
		.replace(/\.js$/, '');
}
