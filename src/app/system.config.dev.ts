SystemJS.config({
    baseURL: './',
    defaultJSExtensions: true
});
//Import root modules here
Promise.all([
    SystemJS.import('app/app-config'),
    SystemJS.import('app/app-module')
]);
