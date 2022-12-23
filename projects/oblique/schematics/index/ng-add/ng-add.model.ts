export interface ObIOptionsSchema {
	ajv: boolean;
	banner: boolean;
	environments: string;
	eslint: boolean;
	externalLink: boolean;
	font: string;
	httpInterceptors: boolean;
	husky: boolean;
	jenkins: string;
	jest: boolean;
	locales: string;
	mandatory: boolean;
	npmrc: boolean;
	prefix: string;
	protractor: boolean;
	proxy: string;
	sonar: boolean;
	static: boolean;
	title: string;
	unknownRoute: boolean;
}

export interface ObIVersion {
	major: number;
	minor: number;
	patch: number;
}
