import {readFileSync, writeFileSync} from 'fs';
import {execSync} from 'child_process';

interface Commits {
	fix: string[];
	feat: string[];
	breakingChanges: string[];
}

interface Commit {
	type: string;
	scope: string;
	subject: string;
	breakingChanges: string;
	hash: string;
}

export class Changelog {
	static perform(nextVersion: string): void {
		const previousVersion = Changelog.getPreviousVersion();
		Changelog.writeChangelog(Changelog.getCommits(previousVersion), previousVersion, nextVersion);
	}

	private static getPreviousVersion(): string {
		return execSync('git describe --tags --abbrev=0').toString().trim();
	}

	private static getCommits(previousVersion: string): Commits {
		const separator = ';;';
		const commitSeparator = '##';
		return execSync(`git log --pretty=format:"%s${separator}%b${separator}%H${commitSeparator}" ${previousVersion}..HEAD`)
			.toString()
			.replace(/\n/g, '')
			.split(commitSeparator)
			.filter(commit => /^(?:fix|feat)\(oblique(?!\/toolchain)/.test(commit))
			.map(commit => commit.replace('oblique/', ''))
			.map(commit => Changelog.formatCommit(commit, separator))
			.sort((first, second) => first.scope.localeCompare(second.scope))
			.reduce<Commits>(Changelog.groupCommitsByType, {fix: [], feat: [], breakingChanges: []});
	}

	private static formatCommit(commit: string, separator: string): {text: string; type: string; scope: string; breakingChanges: string[]} {
		const {type, scope, subject, breakingChanges, hash} = Changelog.parseCommit(commit, separator);
		return {
			text: `- **${scope}:** ${subject} ([${hash.substring(0, 8)}](https://github.com/oblique-bit/oblique/commit/${hash}))`,
			type,
			scope,
			breakingChanges: Changelog.parseBreakingChanges(breakingChanges, scope)
		};
	}

	private static parseCommit(commit: string, separator: string): Commit {
		const {type, scope, subject, breakingChanges, hash} = new RegExp(
			`(?<type>\\w+)\\((?<scope>[\\w-]+)\\): (?<subject>[^${separator}]*)${separator}.*?(?:BREAKING CHANGE:(?<breakingChanges>[^${separator}]*))?${separator}(?<hash>\\w*)`
		).exec(commit).groups;
		return {type, scope, subject, breakingChanges, hash};
	}

	private static parseBreakingChanges(breakingChanges: string, scope: string): string[] {
		return breakingChanges
			? breakingChanges
					.split('*')
					.filter(change => !!change)
					.map(change => `- **${scope}:** ${change.trim()}`)
			: [];
	}

	private static groupCommitsByType(changes: Commits, commit: {text: string; type: string; breakingChanges: string[]}): Commits {
		return {
			...changes,
			[commit.type]: [...changes[commit.type], commit.text],
			breakingChanges: [...changes.breakingChanges, ...commit.breakingChanges]
		};
	}

	private static writeChangelog(commits: Commits, previousVersion: string, nextVersion: string): void {
		writeFileSync(
			'CHANGELOG.md',
			[
				Changelog.getTitle(nextVersion, previousVersion),
				Changelog.getSection(commits.fix, 'Bug Fixes'),
				Changelog.getSection(commits.feat, 'Features'),
				Changelog.getSection(commits.breakingChanges, 'BREAKING CHANGES'),
				readFileSync('CHANGELOG.md').toString()
			].join('\n\n')
		);
	}

	private static getTitle(nextVersion: string, previousVersion: string): string {
		const today = new Date().toISOString().split('T')[0];
		return `# [${nextVersion}](https://github.com/oblique-bit/oblique/compare/${previousVersion}...${nextVersion}) (${today})`;
	}

	private static getSection(commits: string[], title: string): string {
		return commits.length ? `## ${title}\n\n${commits.join('\n')}` : '';
	}
}
