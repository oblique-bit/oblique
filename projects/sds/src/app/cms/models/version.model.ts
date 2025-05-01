// This is due to the CMS naming convention.
export interface VersionCms {
	data: Version[];
}

export interface Version {
	id: number;
	version_number: number;
	base_url: string;
}
