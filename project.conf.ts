export const ProjectConfig = {
	app: {
		/**
		 * Title is used for displaying the application name
		 * and for setting the content of the `<title />` HEAD element.
		 *
		 * Should you require internationalization for the app title,
		 * use an Angular expression instead:
		 * {{"i18n.application.title" | translate}}
		 */
		title: 'ObliqueReactive',
		home: '/home',
		locales: ['de', 'fr', 'it', 'en'], // List of available locales
		defaults: {
			locale: 'en'
		},

		// Theming:
		theme: {
			offcanvas:      false, // Enables offcanvas sidebar.
			noNavigation:   false,  // Collapses application navigation.
			body: {
				'class': 'has-overlay',
				attributes: null
			},
			application: {
				fixed:       false,
				attributes: 'orMasterLayoutApplication orScrollDetection orOffcanvas'
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

		// Assets location:
		assets:  'assets/'
	}
};
