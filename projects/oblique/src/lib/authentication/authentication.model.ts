export interface ObIResourceAccessToken {
	resource_access: Record<string, ObIRawRoles>;
}

export interface ObIRawRoles {
	roles: string[];
}

export interface ObIResourceAccessRoles {
	name: string;
	roles: string[];
}
