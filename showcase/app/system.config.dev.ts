SystemJS.config({
	baseURL: './',
	defaultJSExtensions: true
});

// Import the app-root:
Promise.all([
	SystemJS.import('app/app-config'),
	SystemJS.import('app/app-module'),
]);
