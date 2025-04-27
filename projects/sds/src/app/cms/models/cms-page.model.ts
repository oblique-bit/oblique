// This is due to the CMS naming convention.

export interface CMSPageShortList {
	data: CMSPage[];
}

export interface CMSPage {
	id: number;
	name: string;
	slug: string;
	category: number;
	min_version: number;
	max_version: number;
}
