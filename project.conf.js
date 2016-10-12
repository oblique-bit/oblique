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
				},
				format: {
					date: 'd!.M!.yyyy', // Default date format for parsing
					dateAlt: ['d!.M!.yy'] // Alternative date formats for the datePicker
				}
			},
			"api": {
				// Relative path prefix for API calls:
				"path": "api",

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
				"app/bundles/app.js"
			],
			"app": [
				"app/app-config.js"
			],
			"vendor": {
				"js": [
					"moment/moment.js",
					"lodash/lodash.js",
					"angular/angular.js",
					"angular-animate/angular-animate.js",
					"angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
					"angular-confirm/angular-confirm.js",
					"angular-cookies/angular-cookies.js",
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
					"angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect.js",
					"checklist-model/checklist-model.js",
					"satellizer/dist/satellizer.js",
					"tv4/tv4.js",
					"tv4/lang/de.js",
					"tv4/lang/fr.js"
				],
				"css": [
					"angular/angular-csp.css",
					"animate.css/animate.css"
				],
				"assets": [],
				"testResources": [
					"systemjs/dist/system.js",
					"systemjs/dist/system-polyfills.js"
				]
			}
		}
	},
	"dev": {
		"name": "dev",
		"app": {
			"systemjs": true
		},
		"resources": {
			"app": [
				"app/system.config.dev.js"
			]
		}
	},
	"prod-local": {
		"name": "dev",
		"app": {
			"systemjs": false
		}
	},
	"prod": {
		"name": "prod",
		"app": {
			"systemjs": false,
			"api": {
				// Relative path prefix for API calls:
				"path": "/oblique-reactive/api",

				// Disable absolute API URL:
				"url": "" // "http://eui.bit.admin.ch:3000"
			}
		}
	}
};
