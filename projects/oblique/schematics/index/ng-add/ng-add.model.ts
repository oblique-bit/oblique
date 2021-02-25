export interface IOptionsSchema {
	ajv: boolean;
	banner: boolean;
	eslint: boolean;
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

export interface Version {
	major: number;
	minor: number;
	patch: number;
}
