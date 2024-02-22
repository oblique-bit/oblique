import {ObINavigationLink} from '../master-layout.model';

export const basicMockLinks: ObINavigationLink[] = [
	{url: 'defaultPathMatch', label: 'default', id: 'default'},
	{
		url: 'prefix/1/users',
		label: 'ItemPrefix',
		id: 'prefix',
		routerLinkActiveOptions: {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'}
	},
	{
		url: 'prefix/2/users',
		label: 'ItemPrefix2',
		id: 'prefix',
		routerLinkActiveOptions: {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'}
	},
	{
		url: 'full/2/users',
		label: 'ItemFull',
		id: 'full',
		routerLinkActiveOptions: {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'}
	}
];

export const mockLinksWithChildren: ObINavigationLink[] = [
	{
		url: 'defaultPathMatch',
		label: 'default',
		id: 'default',
		children: [{url: 'default-path-match-child-1', label: 'default-child-1', id: 'default-1'}]
	},
	{
		url: 'prefix/1/users',
		label: 'ItemPrefix',
		id: 'prefix',
		routerLinkActiveOptions: {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'}
	},
	{
		url: 'prefix/2/users',
		label: 'ItemPrefix2',
		id: 'prefix',
		routerLinkActiveOptions: {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'},
		children: [
			{
				url: 'item-prefix-2-child-1',
				label: 'ItemPrefix2Child1',
				id: 'prefix-child-1',
				children: [
					{url: 'item-prefix-2-child-1-grandchild-1', label: 'ItemPrefix2Child1Grandchild1', id: 'prefix-child-1-grandchild-1'},
					{url: 'item-prefix-2-child-1-grandchild-2', label: 'ItemPrefix2Child1Grandchild2', id: 'prefix-child-1-grandchild-2'}
				]
			},
			{
				url: 'item-prefix-2-child-2',
				label: 'ItemPrefix2Child2',
				id: 'prefix-child-2',
				children: [
					{url: 'item-prefix-2-child-2-grandchild-1', label: 'ItemPrefix2Child2Grandchild1', id: 'prefix-child-2-grandchild-1'},
					{url: 'item-prefix-2-child-2-grandchild-2', label: 'ItemPrefix2Child2Grandchild2', id: 'prefix-child-2-grandchild-2'}
				]
			}
		]
	},
	{
		url: 'full/2/users',
		label: 'ItemFull',
		id: 'full',
		routerLinkActiveOptions: {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'},
		children: [
			{
				url: 'item-full-child-1',
				label: 'ItemFullChild1',
				id: 'full-child-1',
				children: [
					{
						url: 'item-full-child-1-grandchild-1',
						label: 'ItemFullChild1Grandchild1',
						id: 'full-child-1-granchild-1',
						children: [
							{
								url: 'item-full-child-1-grandchild-1-great-grandchild-1',
								label: 'ItemFullChild1Grandchild1GreatGrandchild1',
								id: 'full-child-1-grandchild-1-great-grandchild-1'
							},
							{
								url: 'item-full-child-1-grandchild-1-great-grandchild-2',
								label: 'ItemFullChild1Grandchild1GreatGrandchild2',
								id: 'full-child-1-grandchild-1-great-grandchild-2'
							},
							{
								url: 'item-full-child-1-grandchild-1-great-grandchild-3',
								label: 'ItemFullChild1Grandchild1GreatGrandchild3',
								id: 'full-child-1-grandchild-1-great-grandchild-3'
							}
						]
					},
					{
						url: 'item-full-child-1-grandchild-2',
						label: 'ItemFullChild1Grandchild2',
						id: 'full-child-1-grandchild-2',
						children: [
							{
								url: 'item-full-child-1-grandchild-2-great-grandchild-1',
								label: 'ItemFullChild1Grandchild2GreatGrandchild1',
								id: 'full-child-1-grandchild-2-great-grandchild-1'
							},
							{
								url: 'item-full-child-1-grandchild-2-great-grandchild-2',
								label: 'ItemFullChild1Grandchild2GreatGrandchild2',
								id: 'full-child-1-grandchild-2-great-grandchild-2'
							},
							{
								url: 'item-full-child-1-grandchild-2-great-grandchild-3',
								label: 'ItemFullChild1Grandchild2GreatGrandchild3',
								id: 'full-child-1-grandchild-2-great-grandchild-3'
							}
						]
					},
					{
						url: 'item-full-child-1-grandchild-3',
						label: 'ItemFullChild1Grandchild3',
						id: 'full-child-1-grandchild-3',
						children: [
							{
								url: 'item-full-child-1-grandchild-3-great-grandchild-1',
								label: 'ItemFullChild1Grandchild3GreatGrandchild1',
								id: 'full-child-1-grandchild-3-great-grandchild-1'
							},
							{
								url: 'item-full-child-1-grandchild-3-great-grandchild-2',
								label: 'ItemFullChild1Grandchild3GreatGrandchild2',
								id: 'full-child-1-grandchild-3-great-grandchild-2'
							},
							{
								url: 'item-full-child-1-grandchild-3-great-grandchild-3',
								label: 'ItemFullChild1Grandchild3GreatGrandchild3',
								id: 'full-child-1-grandchild-3-great-grandchild-3'
							}
						]
					}
				]
			},
			{
				url: 'item-full-child-2',
				label: 'ItemFullChild2',
				id: 'full-child-2',
				children: [
					{
						url: 'item-full-child-2-grandchild-1',
						label: 'ItemFullChild2Grandchild1',
						id: 'full-child-2-grandchild-1',
						children: [
							{
								url: 'item-full-child-2-grandchild-1-great-grandchild-1',
								label: 'ItemFullChild2Grandchild1GreatGrandchild1',
								id: 'full-child-2-grandchild-1-great-grandchild-1'
							},
							{
								url: 'item-full-child-2-grandchild-1-great-grandchild-2',
								label: 'ItemFullChild2Grandchild1GreatGrandchild2',
								id: 'full-child-2-grandchild-1-great-grandchild-2'
							},
							{
								url: 'item-full-child-2-grandchild-1-great-grandchild-3',
								label: 'ItemFullChild2Grandchild1GreatGrandchild3',
								id: 'full-child-2-grandchild-1-great-grandchild-3'
							}
						]
					},
					{
						url: 'item-full-child-2-grandchild-2',
						label: 'ItemFullChild2Grandchild2',
						id: 'full-child-2-grandchild-2',
						children: [
							{
								url: 'item-full-child-2-grandchild-2-great-grandchild-1',
								label: 'ItemFullChild2Grandchild2GreatGrandchild1',
								id: 'full-child-2-grandchild-2-great-grandchild-1'
							},
							{
								url: 'item-full-child-2-grandchild-2-great-grandchild-2',
								label: 'ItemFullChild2Grandchild2GreatGrandchild2',
								id: 'full-child-2-grandchild-2-great-grandchild-2'
							},
							{
								url: 'item-full-child-2-grandchild-2-great-grandchild-3',
								label: 'ItemFullChild2Grandchild2GreatGrandchild3',
								id: 'full-child-2-grandchild-2-great-grandchild-3'
							}
						]
					},
					{
						url: 'item-full-child-2-grandchild-3',
						label: 'ItemFullChild2Grandchild3',
						id: 'full-child-2-grandchild-3',
						children: [
							{
								url: 'item-full-child-2-grandchild-3-great-grandchild-1',
								label: 'ItemFullChild2Grandchild3GreatGrandchild1',
								id: 'full-child-2-grandchild-3-great-grandchild-1'
							},
							{
								url: 'item-full-child-2-grandchild-3-great-grandchild-2',
								label: 'ItemFullChild2Grandchild3GreatGrandchild2',
								id: 'full-child-2-grandchild-3-great-grandchild-2'
							},
							{
								url: 'item-full-child-2-grandchild-3-great-grandchild-3',
								label: 'ItemFullChild2Grandchild3GreatGrandchild3',
								id: 'full-child-2-grandchild-3-great-grandchild-3'
							}
						]
					}
				]
			},
			{
				url: 'item-full-child-3',
				label: 'ItemFullChild3',
				id: 'full-child-3',
				children: [
					{
						url: 'item-full-child-3-grandchild-1',
						label: 'ItemFullChild3Grandchild1',
						id: 'full-child-3-grandchild-1',
						children: [
							{
								url: 'item-full-child-3-grandchild-1-great-grandchild-1',
								label: 'ItemFullChild3Grandchild1GreatGrandchild1',
								id: 'full-child-3-grandchild-1-great-grandchild-1'
							},
							{
								url: 'item-full-child-3-grandchild-1-great-grandchild-2',
								label: 'ItemFullChild3Grandchild1GreatGrandchild2',
								id: 'full-child-3-grandchild-1-great-grandchild-2'
							},
							{
								url: 'item-full-child-3-grandchild-1-great-grandchild-3',
								label: 'ItemFullChild3Grandchild1GreatGrandchild3',
								id: 'full-child-3-grandchild-1-great-grandchild-3'
							}
						]
					},
					{
						url: 'item-full-child-3-grandchild-2',
						label: 'ItemFullChild3Grandchild2',
						id: 'full-child-3-grandchild-2',
						children: [
							{
								url: 'item-full-child-3-grandchild-2-great-grandchild-1',
								label: 'ItemFullChild3Grandchild2GreatGrandchild1',
								id: 'full-child-3-grandchild-2-great-grandchild-1'
							},
							{
								url: 'item-full-child-3-grandchild-2-great-grandchild-2',
								label: 'ItemFullChild3Grandchild2GreatGrandchild2',
								id: 'full-child-3-grandchild-2-great-grandchild-2'
							},
							{
								url: 'item-full-child-3-grandchild-2-great-grandchild-3',
								label: 'ItemFullChild3Grandchild2GreatGrandchild3',
								id: 'full-child-3-grandchild-2-great-grandchild-3'
							}
						]
					},
					{
						url: 'item-full-child-3-grandchild-3',
						label: 'ItemFullChild3Grandchild3',
						id: 'full-child-3-grandchild-3',
						children: [
							{
								url: 'item-full-child-3-grandchild-3-great-grandchild-1',
								label: 'ItemFullChild3Grandchild3GreatGrandchild1',
								id: 'full-child-3-grandchild-3-great-grandchild-1'
							},
							{
								url: 'item-full-child-3-grandchild-3-great-grandchild-2',
								label: 'ItemFullChild3Grandchild3GreatGrandchild2',
								id: 'full-child-3-grandchild-3-great-grandchild-2'
							},
							{
								url: 'item-full-child-3-grandchild-3-great-grandchild-3',
								label: 'ItemFullChild3Grandchild3GreatGrandchild3',
								id: 'full-child-3-grandchild-3-great-grandchild-3'
							}
						]
					}
				]
			}
		]
	}
];
