export interface ObIResourceAccessToken {
	resource_access: Record<string, ObIRawRoles>; // eslint-disable-line @typescript-eslint/naming-convention
}

export interface ObIRawRoles {
	roles: string[];
}

export interface ObIResourceAccessRoles {
	name: string;
	roles: string[];
}
