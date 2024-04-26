import {execSync} from 'child_process';

export class Lint {
	static perform(param: string): void {
		const lintParam = param === '--fix' ? '--fix' : '';
		const prettierParam = param === '--fix' ? '--write' : '--check';
		Lint.execute(`eslint -c .eslintrc.local.yml "**/*.{ts,js,html}" --cache ${lintParam}`);
		Lint.execute(`stylelint "**/*.{css,scss}" --cache ${lintParam} --allow-empty-input`);
		Lint.execute(
			`prettier "**/*.{ts,js,html,json,yml,md,css,scss}" --cache --cache-location=.prettiercache --log-level warn ${prettierParam}`
		);
	}

	private static execute(command: string): void {
		execSync(command, {stdio: 'inherit'});
	}
}

Lint.perform(process.argv[2]);
