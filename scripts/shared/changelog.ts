import {readFileSync, writeFileSync} from 'fs';
import {getResultFromCommand} from './utils';

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

	static addRelease(version: string, projectName: string): void {
		const previousTag = Changelog.getPreviousTag();
		Changelog.prependRelease(Changelog.getCommits(previousTag, 'HEAD', projectName), previousTag, version);
	}

	static generate(projectName: string): void {
		getResultFromCommand(' git tag --sort v:refname')
			.split('\n')
			.filter(tag => /^\d+\.\d+\.\d+$/.test(tag))
			.map((tag, index, tags) => ({from: tag, to: tags[index + 1]}))
			.filter(({to}) => !!to)
			.forEach(({from, to}) => Changelog.prependRelease(Changelog.getCommits(from, to, projectName), from, to));
	}

	private static getPreviousTag(): string {
		return getResultFromCommand('git describe --tags --abbrev=0');
	}

	private static getCommits(from: string, to: string, projectName: string): Commits {
		const separator = ';;';
		const commitSeparator = '##';
		return getResultFromCommand(`git log --pretty=format:"%s${separator}%b${separator}%H${commitSeparator}" ${from}..${to}`)
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

	private static prependRelease(commits: Commits, previousTag: string, version: string): void {
		if (commits.feat.length || commits.fix.length) {
			writeFileSync(
				'CHANGELOG.md',
				[
					Changelog.getTitle(version, previousTag),
					Changelog.getSection(commits.fix, 'Bug Fixes'),
					Changelog.getSection(commits.feat, 'Features'),
					Changelog.getSection(commits.breakingChanges, 'BREAKING CHANGES'),
					readFileSync('CHANGELOG.md').toString()
				].join('\n\n')
			);
		}
	}

	private static getTitle(version: string, previousTag: string): string {
		const date = Changelog.getReleaseDate(version);
		return `# [${version}](https://github.com/oblique-bit/oblique/compare/${previousTag}...${version}) (${date})`;
	}

	private static getReleaseDate(tag: string): string {
		return getResultFromCommand(`git tag -l ${tag}`)
			? getResultFromCommand(`git log -1 --format=%as ${tag}`)
			: new Date().toISOString().split('T')[0];
	}

	private static getSection(commits: string[], title: string): string {
		return commits.length ? `## ${title}\n\n${commits.join('\n')}` : '';
	}
}
