import {execSync} from 'child_process';

export class Eslint {
	static perform(param = ''): void {
		execSync(`eslint "{src,projects,scripts,tests}/**/*.{ts,js,html}" --cache ${param}`, {stdio: 'inherit'});
	}
}
