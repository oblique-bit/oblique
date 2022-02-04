// This script is used to deprecate old Oblique versions. It can be used in two ways:

// 1. deprecate a list of versions published under the "next" tag. The first argument is the date, in ISO format, when the final version has been released.
//    The remaining arguments are a list of the exact versions that have to be deprecate.
//    ts-node scripts/npm-deprecate.ts 2021-11-02 6.0.0-RC.1 6.0.0-alpha.1

// 2. deprecate a range of versions published under the "latest" tag. The first argument is the EOL date, in ISO format, when the targeted major version has
//    reach its end of life. The second one is the major version that has to be deprecate.
//    ts-node scripts/npm-deprecate.ts 2021-11-02 6

import {execSync} from 'child_process';
import {exit} from 'process';

class NpmDeprecate {
	static perform(date: string, versions: string[]): void {
		if (!NpmDeprecate.isDateValid(date) || !versions.length || !NpmDeprecate.areVersionsValid(versions)) {
			console.error(`This script needs at least 2 arguments and will deprecate, either a list of pre-versions under the "next" tag, or all versions of a major version under the "latest" tag.
			\nIn the first case a date, in ISO format, and a list of exact versions, e.g. "2021-11-02 6.0.0-RC.1 6.0.0-alpha.1", are expected. All listed version will be deprecated with the given date as the deprecation date.
			\nIn the second case, a date, in ISO format, and a major version number, e.g. "2021-11-02 6" are expected. All versions starting with the number will be deprecated with the given date as the deprecation date.`);
			exit(-1);
		}
		NpmDeprecate.login();

		if (versions.length === 1 && /^\d+$/.test(versions[0])) {
			NpmDeprecate.deprecateMajorVersion(versions[0], date);
		} else {
			versions.forEach(version => NpmDeprecate.deprecateExactVersion(version, date));
			NpmDeprecate.removeNextTag();
		}
	}

	private static isDateValid(date: string): boolean {
		return /^20\d{2}-(?:0[1-9]|1[012])-(?:0[1-9]|1\d|3[01])$/.test(date);
	}

	private static areVersionsValid(versions: string[]): boolean {
		return versions.reduce((areValid, version) => areValid && /^\d+$|^\d+\.\d+\.\d+-(?:RC|beta|alpha)\.\d+$/.test(version), true);
	}

	private static login(): void {
		if (execSync(`npm whoami`).toString().trim() !== 'oblique') {
			execSync('npm login');
		}
	}

	private static deprecateMajorVersion(version: string, date: string): void {
		execSync(`npm deprecate @oblique/oblique@${version}.x "Oblique ${version} has reached its End Of Life on ${date}"`);
	}

	private static deprecateExactVersion(version: string, date: string): void {
		execSync(`npm deprecate @oblique/oblique@${version} "Oblique ${version.split('.')[0]} has been released on ${date}"`);
	}

	private static removeNextTag(): void {
		if (execSync(`npm dist-tag`).toString().includes('next')) {
			execSync(`npm dist-tag rm @oblique/oblique next`);
		}
	}
}

NpmDeprecate.perform(process.argv[2], process.argv.slice(3));
