// This is due to the CMS naming convention.
/* eslint-disable @typescript-eslint/naming-convention */
export interface VersionCms {
	data: Version[];
}

export interface Version {
	id: number;
	version_number: number;
}
