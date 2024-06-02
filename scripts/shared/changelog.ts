import {readFileSync, writeFileSync} from 'fs';
import {executeCommand} from './utils';

type CommitType = 'fix' | 'feat';

interface Commits {
	fix: string[];
	feat: string[];
	breakingChanges: string[];
}

interface Commit {
	type: CommitType;
	scope: string;
	subject: string;
	breakingChanges: string;
	hash: string;
}

export class Changelog {
	constructor() {
		throw new Error('"Changelog" may not be instantiated.');
	}

	static update(nextVersion: string, projectName: string): void {
		const previousVersion = Changelog.getPreviousVersion();
		Changelog.writeChangelog(Changelog.getCommits(previousVersion, projectName), previousVersion, nextVersion);
	}

	private static getPreviousVersion(): string {
		return executeCommand('git describe --tags --abbrev=0');
	}

	private static getCommits(previousVersion: string, projectName: string): Commits {
		const separator = ';;';
		const commitSeparator = '##';
		return executeCommand(`git log --pretty=format:"%s${separator}%b${separator}%H${commitSeparator}" ${previousVersion}..HEAD`)
			.replace(/\n/g, '')
			.split(commitSeparator)
			.filter(commit => new RegExp(`^(?:fix|feat)\\(${projectName}(?!/toolchain)`).test(commit))
			.map(commit => commit.replace(`${projectName}/`, ''))
			.map(commit => Changelog.formatCommit(commit, separator))
			.sort((first, second) => first.scope.localeCompare(second.scope))
			.reduce<Commits>(Changelog.groupCommitsByType, {fix: [], feat: [], breakingChanges: []});
	}

	private static formatCommit(
		commit: string,
		separator: string
	): {text: string; type: CommitType; scope: string; breakingChanges: string[]} {
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
		return {type, scope, subject, breakingChanges, hash} as Commit;
	}

	private static parseBreakingChanges(breakingChanges: string, scope: string): string[] {
		return breakingChanges
			? breakingChanges
					.split('*')
					.filter(change => !!change)
					.map(change => `- **${scope}:** ${change.trim()}`)
			: [];
	}

	private static groupCommitsByType(changes: Commits, commit: {text: string; type: CommitType; breakingChanges: string[]}): Commits {
		return {
			...changes,
			[commit.type]: [...changes[commit.type], commit.text],
			breakingChanges: [...changes.breakingChanges, ...commit.breakingChanges]
		};
	}

	private static writeChangelog(commits: Commits, previousVersion: string, nextVersion: string): void {
		if (commits.feat.length || commits.fix.length) {
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
	}

	private static getTitle(nextVersion: string, previousVersion: string): string {
		const today = new Date().toISOString().split('T')[0];
		return `# [${nextVersion}](https://github.com/oblique-bit/oblique/compare/${previousVersion}...${nextVersion}) (${today})`;
	}

	private static getSection(commits: string[], title: string): string {
		return commits.length ? `## ${title}\n\n${commits.join('\n')}` : '';
	}
}
