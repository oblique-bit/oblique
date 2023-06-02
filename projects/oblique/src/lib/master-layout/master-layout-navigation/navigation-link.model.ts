import {IsActiveMatchOptions} from '@angular/router';
import {ObEIcon} from '../../icon/icon.model';
import {ObINavigationLink} from '../master-layout.model';

export class ObNavigationLink implements ObINavigationLink {
	id: string;
	isExternal: boolean;
	label: string;
	url: string;
	active?: boolean;
	children?: ObNavigationLink[];
	fragment?: string;
	icon?: ObEIcon | string;
	iconOnly?: boolean;
	queryParams?: Record<string, string>;
	routerLinkActiveOptions?: IsActiveMatchOptions;
	sameTarget?: boolean;
	startOfRightSideLinks?: boolean;

	constructor(link?: ObINavigationLink) {
		this.id = link?.id ?? ObNavigationLink.getKebabCaseId(link?.label, link?.url);
		this.isExternal = !!(link?.isExternal ?? /^https?:\/\//.test(link?.url ?? ''));
		this.label = link?.label ?? '';
		this.url = link?.url ?? '';
		this.active = link?.active;
		this.children = link?.children?.map(child => new ObNavigationLink(child));
		this.fragment = link?.fragment;
		this.icon = link?.icon;
		this.iconOnly = link?.iconOnly;
		this.queryParams = link?.queryParams;
		this.routerLinkActiveOptions = link?.routerLinkActiveOptions;
		this.sameTarget = link?.sameTarget;
		this.startOfRightSideLinks = link?.startOfRightSideLinks;
	}

	private static getKebabCaseId(label = '', url = ''): string {
		return (label ? `${label}-${url}` : url)
			.replace(/(?<=[a-z0-9])(?=[A-Z])/g, '-')
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9-]/g, '-')
			.replace(/-{2,}/g, '-')
			.replace(/^-|-$/g, '');
	}
}
