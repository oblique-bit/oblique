import {execSync} from 'child_process';

export class Lint {
	static perform(param: string): void {
		const lintParam = param === '--fix' ? '--fix' : '';
		const prettierParam = param === '--fix' ? '--write' : '--check';
		const prettierFiles = '{ts,js,html,json,yml,md,css,scss}';
		Lint.execute(`eslint "{scripts,tests}/**/*.{ts,js,html}" --cache ${lintParam}`);
		Lint.execute(`prettier "{scripts,tests}/**/*.${prettierFiles}" "*.${prettierFiles}" --log-level warn ${prettierParam}`);
	}

	private static execute(command: string): void {
		execSync(command, {stdio: 'inherit'});
	}
}

Lint.perform(process.argv[2]);
