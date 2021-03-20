export interface ObIOptionsSchema {
	ajv: boolean;
	banner: boolean;
	eslint: boolean;
	externalLink: boolean;
	font: string;
	httpInterceptors: boolean;
	husky: boolean;
	ie11: boolean;
	jenkins: string;
	jest: boolean;
	locales: string;
	npmrc: boolean;
	prefix: string;
	protractor: boolean;
	proxy: string;
	sonar: boolean;
	static: boolean;
	theme: string;
	title: string;
	unknownRoute: boolean;
}

export interface ObIVersion {
	major: number;
	minor: number;
	patch: number;
}
