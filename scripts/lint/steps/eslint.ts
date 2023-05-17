import {execSync} from 'child_process';

export class Eslint {
	static perform(param = ''): void {
		execSync(`eslint "{projects,scripts,tests}/**/*.{ts,js,html}" --cache ${param}`, {stdio: 'inherit'});
	}
}
