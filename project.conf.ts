export const ProjectConfig = {
	app: {
		title: 'ObliqueReactive',
		home: '/home',
		locales: ['de', 'fr', 'it', 'en'], // List of available locales
		defaults: {
			locale: 'en'
		},

		// Theming:
		theme: {
			body: {
				'class': 'has-overlay',
				attributes: null
			},
			application: {
				fixed:       false,
				attributes: 'orMasterLayoutApplication orScrollDetection'
			},
			header: {
				animate:    true,
				attributes: 'orMasterLayoutHeader',
				sticky:     true,
				variant:    null // Possible value(s): 'application-header-md'
			},
			footer: {
				variant:    null // Possible value(s): 'application-footer-sm'
			},
			navigation: {
				scrollable:  true // Enable if your primary navigation has a lot of first-level menu entries.
			}
		},

		// References:
		vendor: {
			path: 'assets/',
			obliqueui: {
				path: 'oblique-ui/'
			}
		}
	}
};
