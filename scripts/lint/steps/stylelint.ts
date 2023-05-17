import {execSync} from 'child_process';

export class Stylelint {
	static perform(param = ''): void {
		execSync(`stylelint "{src,projects}/**/*.{css,scss}" --cache ${param} --allow-empty-input`, {stdio: 'inherit'});
	}
}
