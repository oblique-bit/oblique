export interface ObIOptionsSchema {
	ajv: boolean;
	applicationOperator: string;
	banner: boolean;
	contact: string;
	environments: string;
	eslint: boolean;
	externalLink: boolean;
	httpInterceptors: boolean;
	husky: boolean;
	jest: boolean;
	locales: string;
	mandatory: boolean;
	prefix: string;
	title: string;
	unknownRoute: boolean;
	hasLanguageInUrl: boolean;
}

export interface ObIVersion {
	major: number;
	minor: number;
	patch: number;
}
