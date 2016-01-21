module.exports = {
	"build": {
		"target": "target/"
	},
	"app": {
		"module": "oblique",
		"title": "ObliqueReactive",
		"description": "Reactive front-end template for your business web application. Powered by ObliqueUI and AngularJS.",
		"home": "#/home",
		"locales": ["de", "fr", "it", "en"], // List of available locales
		"defaults": {
			"locale": "en",
			"state": "home",
			"layout": "default",
			"http": {
				"timeout": 10000
			}
		},
		"api": {
			"schema": "http",
			"hostname": "localhost",
			"port": 3000,
			"context": "/api",
			"logs": "/logs",
			"sendCredentials": false
		},

		"web": {
			"hostname": "localhost",
			"port": 9000
		}
	},
	"resources": {
		"assets": ['images/**/*', 'js/**/*', 'fonts/**/*'],
		"app": [
			"app/app-config.js",
			"app/app-module.js",
			"app/app-controller.js",
			"app/app-templates.js",

			"app/common/common-module.js",
			"app/common/auth/auth-service.js",

			"app/oblique/oblique-module.js",

			"app/oblique/formatters/date-directive.js",
			"app/oblique/formatters/number-format-directive.js",

			"app/oblique/infrastructure/log-decorator.js",
			"app/oblique/infrastructure/http-decorator.js",
			"app/oblique/infrastructure/http-interceptor.js",
			"app/oblique/infrastructure/exception-handler-decorator.js",
			"app/oblique/infrastructure/state-decorator.js",

			"app/oblique/navigator/navigator-directive.js",
			"app/oblique/navigator/navigator-service.js",

			"app/oblique/status/loading-service.js",

			"app/oblique/ui/date-picker/date-picker-directive.js",
			"app/oblique/ui/notifications/notifications-directive.js",
			"app/oblique/ui/notifications/notification-service.js",
			"app/oblique/ui/delayed-change-directive.js",
			"app/oblique/ui/dropdown-closable-directive.js",
			"app/oblique/ui/enter-directive.js",
			"app/oblique/ui/give-me-focus-directive.js",
			"app/oblique/ui/multiselect-directive.js",
			"app/oblique/ui/navigable-directive.js",
			"app/oblique/ui/typeahead-extensions-directive.js",

			"app/oblique/validation/has-error-directive.js",
			"app/oblique/validation/schema-validate-directive.js",
			"app/oblique/validation/schema-validator-service.js",

			"app/states/auth/auth-module.js",
			"app/states/auth/auth-controller.js",
			"app/states/home/home-module.js",
			"app/states/home/home-controller.js",
			"app/states/movies/movies-module.js",
			"app/states/movies/movie-resource.js",
			"app/states/movies/movie-service.js",
			"app/states/movies/movies-controller.js",
			"app/states/samples/samples-module.js",
			"app/states/samples/datepicker/datepicker-sample-module.js",
			"app/states/samples/datepicker/datepicker-sample-controller.js",
			"app/states/samples/schema-validation/schema-validation-sample-module.js",
			"app/states/samples/schema-validation/schema-validation-sample-controller.js",
		    "app/states/samples/multiselect/multiselect-sample-module.js",
		    "app/states/samples/multiselect/multiselect-sample-controller.js",
			"app/states/samples/navigable/navigable-sample-module.js",
			"app/states/samples/navigable/navigable-sample-controller.js",
			"app/states/samples/navigator/navigator-sample-module.js",
			"app/states/samples/navigator/navigator-sample-controller.js",
			"app/states/samples/typeahead/typeahead-sample-module.js",
			"app/states/samples/typeahead/typeahead-sample-controller.js",
			"app/states/samples/ui-scroll/ui-scroll-sample-module.js",
			"app/states/samples/ui-scroll/ui-scroll-sample-controller.js"
		],
		"vendor": {
			"js": [
				"moment/moment.js",
				"lodash/lodash.js",
				"angular/angular.js",
				"angular-animate/angular-animate.js",
				"angular-bootstrap/ui-bootstrap-tpls.js",
				"angular-confirm/angular-confirm.js",
				"angular-cookies/angular-cookies.js",
				"angular-dateParser/dist/angular-dateparser.js",
				"angular-dynamic-locale/dist/tmhDynamicLocale.js",
				"angular-elastic/elastic.js",
				"angular-i18n/angular-locale_de.js",
				"angular-i18n/angular-locale_fr.js",
				"angular-i18n/angular-locale_it.js",
				"angular-i18n/angular-locale_en.js",
				"angular-sanitize/angular-sanitize.js",
				"angular-translate/angular-translate.js",
				"angular-translate-loader-static-files/angular-translate-loader-static-files.js",
				"angular-translate-storage-cookie/angular-translate-storage-cookie.js",
				"angular-translate-storage-local/angular-translate-storage-local.js",
				"angular-ui-router/release/angular-ui-router.js",
				"angular-ui-scroll/dist/ui-scroll.js",
				"angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect.js",
				"checklist-model/checklist-model.js",
				"satellizer/satellizer.js",
				"tv4/tv4.js",
				"tv4/lang/de.js",
				"tv4/lang/fr.js"
			],
			"css": [
				"angular/angular-csp.css",
				"animate.css/animate.css"
			],
			"assets": []
		}
	}
};
