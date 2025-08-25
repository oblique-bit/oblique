export enum ObEPamsEnvironment {
	DEV = '-d',
	REF = '-r',
	TEST = '-t',
	ABN = '-a',
	PROD = ''
}

export interface ObIServiceNavigationLink {
	url: string;
	label: string;
}

export interface ObIServiceNavigationContact {
	email?: string;
	phone?: string;
	formUrl?: string;
}

export interface ObISectionLink {
	url: string;
	label: string;
	icon?: string;
	isInternalLink?: boolean;
	ariaLabel?: string | {text: string; parameters: Record<string, unknown>};
}

export type ObLoginState = 'SA' | 'S1' | 'S2OK' | 'S2+OK' | 'S3OK' | 'S3+OK';

export interface ObIServiceNavigationApplication {
	image: string;
	name: string;
	status: ObServiceNavigationApplicationStatus;
	url: string;
}

export type ObServiceNavigationApplicationStatus = 'online' | 'offline' | 'inaccessible';

export interface ObILanguage {
	code: string;
	label: string;
}
