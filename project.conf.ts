module.exports = {
	build: {
		env: 'DEV', //TODO: why?
		target: 'target/'
	},
	app: {
		version:        'TODO',
		module:         'oblique',
		title:          'ObliqueReactive',
		description:    'Reactive front-end template for your business web application. Powered by ObliqueUI and AngularJS.',
		organization: {
			name:       'Federal Office of Information Technology, Systems and Telecommunication FOITT',
			url:        'http://www.bit.admin.ch',
			email:      'info@bit.admin.ch',
			contact:    false
		},
		home:           '#/home',
		locales:        ['de', 'fr', 'it', 'en'], // List of available locales
		defaults: {
			locale:     'en',
			state:      'home',
			layout:     'default',
			http: {
				timeout:10000
			},
			format: {
				date: 'd!.M!.yyyy', // Default date format for parsing
				dateAlt: ['d!.M!.yy'] // Alternative date formats for the datePicker
			}
		},
		api: {
			// Relative path prefix for API calls:
			path: 'api',

			// API endpoint for UI logging:
			logs: '/logs',

			// Should credential be transmitted with requests:
			sendCredentials: false,
			port: 3000
		},

		// Theming:
		theme: {
			tooltips:        true,
			application: {
				fixed:       false
			},
			header: {
				transitions: true
				//variant:   'application-header-sm'
			}
		},

		// References:
		pages: '',
		vendor: {
			path: 'vendor/',
			obliqueui: {
				name: 'oblique-ui',
				title: 'ObliqueUI',
				path: 'oblique-ui/'
			}
		}
	},
	resources: {
		bundles: [
			'app/bundles/app.js'
		],
		app: [
			'app/app-config.js'
		],
		vendor: {
			js: [
				'moment/moment.js',
				'lodash/lodash.js',
				'angular/angular.js',
				'angular-animate/angular-animate.js',
				'angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
				'angular-confirm/angular-confirm.js',
				'angular-cookies/angular-cookies.js',
				'angular-dynamic-locale/dist/tmhDynamicLocale.js',
				'angular-elastic/elastic.js',
				'angular-i18n/angular-locale_de.js',
				'angular-i18n/angular-locale_fr.js',
				'angular-i18n/angular-locale_it.js',
				'angular-i18n/angular-locale_en.js',
				'angular-sanitize/angular-sanitize.js',
				'angular-translate/dist/angular-translate.js',
				'angular-translate-loader-static-files/angular-translate-loader-static-files.js',
				'angular-translate-storage-cookie/angular-translate-storage-cookie.js',
				'angular-translate-storage-local/angular-translate-storage-local.js',
				'angular-ui-router/release/angular-ui-router.js',
				'angular-ui-scroll/dist/ui-scroll.js',
				'angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect.js',
				'checklist-model/checklist-model.js',
				'satellizer/dist/satellizer.js',
				'tv4/tv4.js',
				'tv4/lang/de.js',
				'tv4/lang/fr.js'
			],
			css: [
				'angular/angular-csp.css',
				'animate.css/animate.css'
			],
			assets: [],
			dev: [
				'systemjs/dist/system.js',
				'systemjs/dist/system-polyfills.js'
			]
		}
	}
};
