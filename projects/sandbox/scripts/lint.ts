import {executeCommand} from '../../../scripts/shared/utils';

export class Lint {
	static perform(param: string): void {
		const lintParam = param === '--fix' ? '--fix' : '';
		const prettierParam = param === '--fix' ? '--write' : '--check';
		executeCommand(`eslint -c .eslintrc.local.yml "**/*.{ts,js,html}" --cache ${lintParam}`, true);
		executeCommand(`stylelint "**/*.{css,scss}" --cache ${lintParam} --allow-empty-input`, true);
		executeCommand(
			`prettier "**/*.{ts,js,html,json,yml,md,css,scss}" --cache --cache-location=.prettiercache --log-level warn ${prettierParam}`,
			true
		);
	}
}

Lint.perform(process.argv[2]);
