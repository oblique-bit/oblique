// This is due to the CMS naming convention.
/* eslint-disable @typescript-eslint/naming-convention */
export interface ComponentPageCompleteCms {
	data: ComponentPageComplete;
}

export interface ComponentPageComplete {
	id: number;
	name: string;
	slug: string;
	api: string;
	ui_ux: string;
	min_version: number;
	max_version: number;
}

export interface TabbedPageShortCms {
	data: TabbedPageShort[];
}

export interface TabbedPageShort {
	id: number;
	name: string;
	slug: string;
	min_version: number;
	max_version: number;
}
