import {ObEIcon, type ObINavigationLink} from '@oblique/oblique';

export const appNavigation: ObINavigationLink[] = [
	{
		url: 'home',
		label: 'i18n.routes.home.title',
		icon: ObEIcon.HOME,
		iconOnly: true,
		fragment: 'test',
		queryParams: {param1: 'a', param2: 'b'}
	},
	{url: 'http://www.google.ch', label: 'Google', icon: ObEIcon.SEARCH},
	{url: 'http://www.google.ch', label: 'Google sameTarget', sameTarget: true},
	{url: 'design-system', label: 'Design System', children: [{url: '', label: 'Demo'}]},
	{
		url: 'samples',
		label: 'i18n.routes.samples.title',
		icon: ObEIcon.BOOKMARK,
		children: [
			{
				url: 'alert',
				label: 'Alert',
				children: [
					{
						url: '1',
						label: 'Alert 1',
						children: [
							{
								url: '1',
								label: 'Alert 1.1',
								children: [
									{
										url: '1',
										label: 'Alert 1.1.1',
										children: [
											{url: '1', label: 'Alert 1.1.1.1'},
											{url: '2', label: 'Alert 1.1.1.2'},
											{url: '3', label: 'Alert 1.1.1.3'}
										]
									},
									{url: '2', label: 'Alert 1.1.2'},
									{url: '3', label: 'Alert 1.1.3'}
								]
							},
							{url: '2', label: 'Alert 1.2'},
							{url: '3', label: 'Alert 1.3'}
						]
					},
					{url: '2', label: 'Alert 2'},
					{url: '3', label: 'Alert 3'}
				]
			},
			{url: 'autocomplete', label: 'Autocomplete'},
			{url: 'breadcrumb', label: 'Breadcrumb'},
			{url: 'button', label: 'Buttons'},
			{
				url: 'collapse',
				label: 'Collapse',
				children: [
					{url: '1', label: 'Collapse 1'},
					{url: '2', label: 'Collapse 2'},
					{url: '3', label: 'Collapse 3'},
					{url: '4', label: 'Collapse 4'},
					{url: '5', label: 'Collapse 5'},
					{url: '6', label: 'Collapse 6'},
					{url: '7', label: 'Collapse 7'},
					{url: '8', label: 'Collapse 8'},
					{url: '9', label: 'Collapse 9'},
					{url: '10', label: 'Collapse 10'},
					{url: '11', label: 'Collapse 11'},
					{url: '12', label: 'Collapse 12'},
					{url: '13', label: 'Collapse 13'},
					{url: '14', label: 'Collapse 14'},
					{url: '15', label: 'Collapse 15'},
					{url: '16', label: 'Collapse 16'},
					{url: '17', label: 'Collapse 17'},
					{url: '18', label: 'Collapse 18'},
					{url: '19', label: 'Collapse 19'},
					{url: '20', label: 'Collapse 20'}
				]
			},
			{url: 'column-layout', label: 'i18n.routes.samples.column-layout.title'},
			{url: 'column-layout-full-height', label: 'Column Layout full height'},
			{url: 'error-messages', label: 'Error messages'},
			{url: 'external-link', label: 'External-link'},
			{url: 'file-upload', label: 'File Upload'},
			{url: 'form', label: 'Forms', children: [{url: '1', label: 'Forms 1'}]},
			{url: 'focus-invalid', label: 'Focus Invalid'},
			{url: 'focus-with-outline', label: 'Focus with outline'},
			{url: 'global-events', label: 'Global events'},
			{url: 'horizontal-forms', label: 'Horizontal Forms'},
			{url: 'http-interceptor', label: 'i18n.routes.samples.http-interceptor.title'},
			{url: 'input-clear', label: 'Input clear'},
			{url: 'language', label: 'Language'},
			{url: 'master-layout', label: 'i18n.routes.samples.master-layout.title'},
			{url: 'multi-translate-loader', label: 'Multi translate loader'},
			{url: 'nav-tree', label: 'i18n.routes.samples.nav-tree.title'},
			{url: 'nested-form', label: 'Nested froms'},
			{url: 'notification', label: 'i18n.routes.samples.notification.title'},
			{url: 'number-format', label: 'i18n.routes.samples.number-format.title'},
			{url: 'popover', label: 'Popover'},
			{url: 'rxjs-operators', label: 'RxJS operators'},
			{url: 'schema-validation', label: 'i18n.routes.samples.schema-validation.title'},
			{url: 'selectable', label: 'Selectable'},
			{url: 'selectable-form', label: 'Selectable Form'},
			{url: 'service-navigation', label: 'Service navigation'},
			{
				url: 'spinner',
				label: 'Spinner',
				children: [
					{url: '1', label: 'Spinner 1'},
					{url: '2', label: 'Spinner 2'},
					{url: '3', label: 'Spinner 3'},
					{url: '4', label: 'Spinner 4'},
					{url: '5', label: 'Spinner 5'}
				]
			},
			{url: 'sticky', label: 'Sticky'},
			{url: 'unknown-route-sample', label: 'Unknown route'},
			{url: 'unsaved-changes', label: 'Unsaved changes'}
		]
	},
	{
		url: 'styles',
		label: 'Styles',
		children: [
			{url: 'alert', label: 'Alert'},
			{url: 'block', label: 'Block elements'},
			{url: 'grid', label: 'Grid system'},
			{url: 'table', label: 'HTML table'},
			{url: 'icon', label: 'Icons as class'},
			{url: 'inline', label: 'Inline elements'},
			{url: 'lists', label: 'Lists'},
			{url: 'palette', label: 'Palette'},
			{url: 'screen-reader-only', label: 'Screen reader only'},
			{url: 'typography', label: 'Typography'}
		]
	},
	{
		url: 'material',
		label: 'Material',
		children: [
			{url: 'badge', label: 'Badge'},
			{url: 'button', label: 'Button'},
			{url: 'card', label: 'Card'},
			{url: 'chips', label: 'Chips'},
			{url: 'datepicker', label: 'Datepicker'},
			{url: 'dialog', label: 'Dialog'},
			{url: 'expansion-panel', label: 'Expansion Panel'},
			{url: 'form', label: 'Forms'},
			{url: 'icon', label: 'Icons'},
			{url: 'list', label: 'List'},
			{url: 'mandatory', label: 'Mandatory'},
			{url: 'menu', label: 'Menu'},
			{url: 'progress-bar', label: 'Progress bar'},
			{url: 'slide-toggle', label: 'Slide Toggle'},
			{url: 'slider', label: 'Slider'},
			{url: 'spinner', label: 'Spinner'},
			{url: 'stepper-horizontal', label: 'Stepper horizontal'},
			{url: 'stepper-vertical', label: 'Stepper vertical'},
			{url: 'table', label: 'Table'},
			{url: 'tabs', label: 'Tabs'},
			{url: 'tooltip', label: 'Tooltip'}
		]
	},
	{
		url: 'icon sample',
		label: 'Icon samples',
		icon: ObEIcon.APPS,
		iconOnly: true,
		children: [
			{url: 'home', icon: ObEIcon.ALD, label: 'Icon with label'},
			{url: 'home', label: 'Label only'},
			{url: 'home', label: 'icon only', icon: ObEIcon.ANCHOR, iconOnly: true},
			{url: 'http://www.google.ch', icon: ObEIcon.ALD, label: 'External, icon with label'},
			{url: 'http://www.google.ch', label: 'External, label only'},
			{url: 'http://www.google.ch', label: 'External, icon only', icon: ObEIcon.ANCHOR, iconOnly: true}
		]
	},
	{
		url: 'starterkit',
		label: 'Starterkit pages',
		children: [
			{url: 'title-page', label: 'Title page'},
			{url: 'nav-page', label: 'Nav page'},
			{url: 'table-page', label: 'Table page'}
		]
	},
	{
		url: 'home',
		label: 'Main Nav',
		children: [
			{
				url: 'home',
				label: 'Sub nav with url',
				children: [{url: 'home', label: 'Subnav'}]
			},
			{
				url: null,
				label: 'Sub nav without url',
				children: [{url: 'home', label: 'Subnav'}]
			}
		]
	},
	{url: 'http://www.google.ch', label: 'About Us', isExternal: true, startOfRightSideLinks: true},
	{url: 'http://www.google.ch', label: 'Contact', isExternal: true}
];
