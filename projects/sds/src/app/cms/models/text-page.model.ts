// This is due to the CMS naming convention.
/* eslint-disable @typescript-eslint/naming-convention */

export interface TextPageCompleteCms {
	data: TextPageComplete;
}

export interface TextPageComplete {
	id: number;
	name: string;
	slug: string;
	category: number;
	description: string;
	min_version: number;
	max_version: number;
}
