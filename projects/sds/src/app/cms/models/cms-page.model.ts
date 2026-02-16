// This is due to the CMS naming convention.

export interface CMSPageShortList {
	data: CMSPage[];
}

export interface CMSPageShort {
	slug: string;
	minVersion: number;
	maxVersion: number;
}

export interface CMSPage {
	id: number;
	name: string;
	slug: string;
	category: number;
	min_version: number;
	max_version: number;
}

export interface CMSPages {
	tabbedPages: CMSPageShortList;
	textPages: CMSPageShortList;
}
