SystemJS.config({
	baseURL: './',
	defaultJSExtensions: true,
	map: {
		'oblique-reactive': 'vendor/oblique-reactive'
	}
});

// Import the app-root:
Promise.all([
	SystemJS.import('app/app-config'),
	SystemJS.import('app/app-module'),
]);
