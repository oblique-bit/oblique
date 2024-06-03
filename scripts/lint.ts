import {executeCommand} from './shared/utils';

export class Lint {
	static perform(param: string): void {
		const lintParam = param === '--fix' ? '--fix' : '';
		const prettierParam = param === '--fix' ? '--write' : '--check';
		const prettierFiles = '{ts,js,html,json,yml,md,css,scss}';
		executeCommand(`eslint "{scripts,tests}/**/*.{ts,js,html}" --cache ${lintParam}`, true);
		executeCommand(`prettier "{scripts,tests}/**/*.${prettierFiles}" "*.${prettierFiles}" --log-level warn ${prettierParam}`, true);
	}
}

Lint.perform(process.argv[2]);
