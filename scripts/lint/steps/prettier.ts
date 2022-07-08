import {execSync} from 'child_process';

export class Prettier {
	static perform(param: string): void {
		execSync(
			`prettier "{src,projects,scripts,tests}/**/*.{ts,js,html,json,yml,md,css,scss}" "*.{ts,js,html,json,yml,md,css,scss}" --loglevel warn ${param}`,
			{stdio: 'inherit'}
		);
	}
}
