import {readFileSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';

export class Changelog {
	static perform(nextVersion: string): void {
		const previousVersion = Changelog.getPreviousVersion();
		Changelog.writeChangelog(previousVersion, nextVersion);
	}

	private static getPreviousVersion(): string {
		return execSync('git describe --tags --abbrev=0').toString().trim();
	}

	private static writeChangelog(previousVersion: string, nextVersion: string): void {
		writeFileSync('CHANGELOG.md', [Changelog.getTitle(nextVersion, previousVersion), readFileSync('CHANGELOG.md').toString()].join('\n\n'));
	}

	private static getTitle(nextVersion: string, previousVersion: string): string {
		const today = new Date().toISOString().split('T')[0];
		return `[${nextVersion}](https://github.com/oblique-bit/oblique/compare/${previousVersion}...${nextVersion}) (${today})`;
	}
}
