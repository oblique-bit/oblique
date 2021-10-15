// This script is used to deprecate old Oblique versions. It can be used in two ways:

// 1. deprecate a list of versions published under the "next" tag. The first argument is the date, in ISO format, when the final version has been released.
//    The remaining arguments are a list of the exact versions that have to be deprecate.
//    ts-node scripts/npm-deprecate.ts 2021-15-02 6.0.0-RC.1 6.0.0-alpha.1

// 2. deprecate a range of versions published under the "latest" tag. The first argument is the EOL date, in ISO format, when the targeted major version has
//    reach its end of life. The second one is the major version that has to be deprecate.
//    ts-node scripts/npm-deprecate.ts 2021-15-02 6

class NpmDeprecate {
	private static readonly execSync = require('child_process').execSync;

	static perform(date: string, versions: string[]): void {
		NpmDeprecate.login();

		if (versions.length === 1 && /^\d+$/.test(versions[0])) {
			NpmDeprecate.deprecateMajorVersion(versions[0], date);
		} else {
			versions.forEach(version => NpmDeprecate.deprecateExactVersion(version, date));
			NpmDeprecate.removeNextTag();
		}
	}

	private static login(): void {
		if (NpmDeprecate.execSync(`npm whoami`) !== 'oblique') {
			NpmDeprecate.execSync('npm login');
		}
	}

	private static deprecateMajorVersion(version: string, date): void {
		NpmDeprecate.execSync(`npm deprecate @oblique/oblique@${version}.x "Oblique ${version} has reached its End Of Life on ${date}"`);
	}

	private static deprecateExactVersion(version: string, date): void {
		NpmDeprecate.execSync(`npm deprecate @oblique/oblique@${version} "Oblique ${version.split('.')[0]} has been released on ${date}"`);
	}

	private static removeNextTag(): void {
		NpmDeprecate.execSync(`npm dist-tag rm @oblique/oblique next`);
	}
}

NpmDeprecate.perform(process.argv[2], process.argv.slice(3));