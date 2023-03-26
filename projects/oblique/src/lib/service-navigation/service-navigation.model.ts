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
	tel?: string;
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
	name: string;
	url: string;
}
