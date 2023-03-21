export enum ObEPamsEnvironment {
	DEV = '-d',
	REF = '-r',
	TEST = '-t',
	ABN = '-a',
	PROD = ''
}

export type ObLoginState = 'SA' | 'S1' | 'S2OK' | 'S2+OK' | 'S3OK' | 'S3+OK';
