import {ObINavigationLink} from '../master-layout.model';

export const basicMockLinks: ObINavigationLink[] = [
	{url: 'defaultPathMatch', label: 'default', id: 'default'},
	{
		url: 'prefix/1/users',
		label: 'ItemPrefix',
		id: 'prefix',
		routerLinkActiveOptions: {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'},
	},
	{
		url: 'prefix/2/users',
		label: 'ItemPrefix2',
		id: 'prefix',
		routerLinkActiveOptions: {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'},
	},
	{
		url: 'full/2/users',
		label: 'ItemFull',
		id: 'full',
		routerLinkActiveOptions: {paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored'},
	},
];
