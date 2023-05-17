// This is due to the CMS naming convention.
/* eslint-disable @typescript-eslint/naming-convention */

export interface DocumentationPageCompleteCms {
	data: DocumentationPageComplete;
}

export interface DocumentationPageComplete {
	id: number;
	name: string;
	slug: string;
	category: number;
	description: string;
	min_version: number;
	max_version: number;
}

export interface DocumentationPageShortCms {
	data: DocumentationPageShort[];
}

export interface DocumentationPageShort {
	id: number;
	name: string;
	slug: string;
	category: number;
	min_version: number;
	max_version: number;
}
