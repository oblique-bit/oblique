module.exports = {
	"common": {
		"name": "common",
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
				// Relative path prefix for API calls:
				"context": "/api",

				// For absolute API URL, comment or provide an empty string to disable:
				"url": "http://localhost:3000",

				// API endpoint for UI logging:
				"logs": "/logs",

				// Should credential be transmitted with requests:
				"sendCredentials": false
			}
		},
		"resources": {
			"bundles": [
				"app/bundles/auth.js",
				"app/bundles/home.js",
				"app/bundles/movies.js",
				"app/bundles/common.js",
				"app/bundles/oblique.js"
			],
			"app": [
				"app/app-config.js",
				"app/app-module.js",
				"app/app-controller.js",
				"app/app-templates.js",

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
					"lodash/index.js",
					"angular/angular.js",
					"angular-animate/angular-animate.js",
					"angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
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
					"angular-translate/dist/angular-translate.js",
					"angular-translate-loader-static-files/angular-translate-loader-static-files.js",
					"angular-translate-storage-cookie/angular-translate-storage-cookie.js",
					"angular-translate-storage-local/angular-translate-storage-local.js",
					"angular-ui-router/release/angular-ui-router.js",
					"angular-ui-scroll/dist/ui-scroll.js",
					"angularjs-dropdown-multiselect-demo/src/angularjs-dropdown-multiselect.js",
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
	},
	"dev": {
		"name": "dev",
		"app": {
			"systemjs": true
		}
	},
	"prod-local": {
		"name": "dev",
		"app": {
			"systemjs": true
		}
	},
	"prod": {
		"name": "prod",
		"app": {
			"systemjs": false,
			"api": {
				// Relative path prefix for API calls:
				"context": "/oblique-reactive/api",

				// Disable absolute API URL:
				"url": "" // "http://eui.bit.admin.ch:3000"
			}
		}
	}
};
