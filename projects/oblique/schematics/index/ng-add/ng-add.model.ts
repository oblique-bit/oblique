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
	npmrc: boolean;
	prefix: string;
	protractor: boolean;
	proxy: string;
	title: string;
	unknownRoute: boolean;
}

export interface ObIVersion {
	major: number;
	minor: number;
	patch: number;
}
