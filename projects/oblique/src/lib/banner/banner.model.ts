export interface ObIBanner {
	text?: string;
	color?: string;
	bgColor?: string;
}

export type ObTBanner = string | ObIBanner | undefined;

export enum ObEEnvironment {
	LOCAL = 'LOCAL',
	DEV = 'DEV',
	REF = 'REF',
	TEST = 'TEST',
	ABN = 'ABN',
}
