// This is due to the CMS naming convention.
/* eslint-disable @typescript-eslint/naming-convention */
export interface CategoryCms {
	data: Category[];
}

export interface Category {
	id: number;
	name: string;
}
