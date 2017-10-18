export const ProjectConfig = {
	build: {
		target: 'target/'
	},
	app: {
		version:        '',
		module:         'oblique',
		title:          'ObliqueReactive',
		description:    'Reactive front-end framework for your business web application. Powered by ObliqueUI and Angular.',
		organization: {
			name:       'Federal Office of Information Technology, Systems and Telecommunication FOITT',
			url:        'http://www.bit.admin.ch',
			email:      'info@bit.admin.ch',
			contact:    false
		},
		home:           '/home',
		locales:        ['de', 'fr', 'it', 'en'], // List of available locales
		defaults: {
			locale:     'en',
			state:      'home',
			layout:     'default',
			http: {
				timeout: 10000
			},
			format: {
				date:   'd!.M!.yyyy', // Default date format for parsing
				dateAlt: ['d!.M!.yy'] // Alternative date formats for the datePicker
			}
		},
		api: {
			// Relative path prefix for API calls:
			context: 'api',

			// Absolute API URL, if required:
			url: undefined,

			// API endpoint for UI logging:
			logs: '/logs',

			// API port:
			port: 3000
		},

		// Theming:
		theme: {
			tooltips:        false, // Handled by ngbTooltip.
			html: {
				attributes: null,
			},
			body: {
				'class': 'has-overlay',
				attributes: null,
			},
			application: {
				fixed:       false,
				attributes: 'orMasterLayoutApplication orScrollDetection'
			},
			header: {
				animate:    true,
				attributes: 'orMasterLayoutHeader',
				sticky:     true,
				variant:    null // 'application-header-md'
			},
			navigation: {
				scrollable: true
			}
		},

		// References:
		vendor: {
			path: 'assets/',
			obliqueui: {
				name: 'oblique-ui',
				title: 'ObliqueUI',
				path: 'oblique-ui/'
			}
		}
	}
};
