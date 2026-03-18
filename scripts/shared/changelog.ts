import {StaticScript} from './static-script';
import {Git} from './git';
import {Log} from './log';
import {fatal} from './utils';
import {Files} from './files';

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
	issues: string;
}

export class Changelog extends StaticScript {
	static addRelease(version: string, projectName: string, additionalPackageWithScope?: string): void {
		Log.info(`Add version ${version} to CHANGELOG.md`);
		if (additionalPackageWithScope && !additionalPackageWithScope.includes('/')) {
			fatal(
				'A package and a scope, separated by a forward slash, e.g. "oblique/service-navigation" is expected. See the root CONTRIBUTING.md for valid packages and the CONTRIBUTING.md of the relevant package for valid scopes.'
			);
		}
		const previousTag = Git.getLatestVersionTag();
		Changelog.prependRelease(
			Changelog.getCommits(previousTag, 'HEAD', projectName, additionalPackageWithScope),
			previousTag,
			version
		);
	}

	static generate(projectName: string): void {
		Log.info(`Generate CHANGELOG.md`);
		Git.listExistingTags()
			.split('\n')
			.filter(tag => /^\d+\.\d+\.\d+$/.test(tag))
			.map((tag, index, tags) => ({from: tag, to: tags[index + 1]}))
			.filter(({to}) => !!to)
			.forEach(({from, to}) => Changelog.prependRelease(Changelog.getCommits(from, to, projectName), from, to));
	}

	private static getCommits(from: string, to: string, projectName: string, additionalPackageWithScope = ''): Commits {
		const separator = ';;';
		const commitSeparator = '##';
		return Git.listCommits(['subject', 'body', 'hash'], separator, commitSeparator, from, to)
			.replace(/\n/g, '')
			.split(commitSeparator)
			.filter(
				commit =>
					new RegExp(`^(?:fix|feat)\\(${projectName}(?:/[a-z-]+)?\\)`).test(commit) ||
					new RegExp(`^(?:fix|feat)\\(${additionalPackageWithScope}\\)`).test(commit)
			)
			.map(commit => commit.replace(`${projectName}/`, ''))
			.map(commit => commit.replace(additionalPackageWithScope, additionalPackageWithScope.split('/').pop()))
			.map(commit => Changelog.formatCommit(commit, separator))
			.sort((first, second) => first.scope.localeCompare(second.scope))
			.reduce<Commits>(Changelog.groupCommitsByType, {fix: [], feat: [], breakingChanges: []});
	}

	private static formatCommit(
		commit: string,
		separator: string
	): {text: string; type: CommitType; scope: string; breakingChanges: string[]} {
		const {type, scope, subject, breakingChanges, hash, issues} = Changelog.parseCommit(commit, separator);

		return {
			text: this.buildText(scope, subject, issues, hash),
			type,
			scope,
			breakingChanges: Changelog.parseBreakingChanges(breakingChanges, scope),
		};
	}

	private static buildText(scope: string, subject: string, issues: string, hash: string): string {
		const sortedIssues = issues ? this.sortIssues(issues) : [];
		const issueWithLinks = this.addGitHubIssueLinks(sortedIssues);
		const ticketsString = issueWithLinks.join(', ');
		const refs = [`[${hash.substring(0, 8)}](https://github.com/oblique-bit/oblique/commit/${hash})`];
		if (ticketsString) {
			refs.push(ticketsString);
		}

		return `- **${scope}:** ${subject} (${refs.join(', ')})`;
	}

	private static sortIssues(issues: string): string[] {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const order = {OUI: 1, GitHub: 2, TPEFD: 3};
		return issues
			.replace(/\s/g, '')
			.split(',')
			.sort((aText, bText) => {
				const cleanedUpA = aText.replace(/[^a-zA-Z]/g, '');
				const cleanedUpB = bText.replace(/[^a-zA-Z]/g, '');
				// Fallback in case we get a ticket not in the order list
				if (!order[cleanedUpA]) {
					return order[cleanedUpB] - 4;
				}
				if (!order[cleanedUpB]) {
					return order[cleanedUpA] - 4;
				}
				return order[cleanedUpA] - order[cleanedUpB];
			});
	}

	private static addGitHubIssueLinks(issues: string[]): string[] {
		issues.forEach((issue, index) => {
			if (issue.includes('GitHub')) {
				const issueNumber = issue.replace(/[^\d]/g, '');
				issues[index] = `[${issue}](https://github.com/oblique-bit/oblique/issues/${issueNumber})`;
			}
		});
		return issues;
	}

	private static parseCommit(commit: string, separator: string): Commit {
		const {type, scope, subject, breakingChanges, hash, issues} = new RegExp(
			String.raw`(?<type>\w+)\((?<scope>[\w-]+)\): (?<subject>[^${separator}]*)${separator}(?<issues>[^${separator}]*\s?\w*?-\d*,?\s?)*.*?(?:BREAKING CHANGE:(?<breakingChanges>[^${separator}]*))?${separator}(?<hash>\w*)`
		).exec(commit).groups;
		return {type, scope, subject, breakingChanges, hash, issues} as Commit;
	}

	private static parseBreakingChanges(breakingChanges: string, scope: string): string[] {
		return breakingChanges
			? breakingChanges
					.replace(/\*\*/g, '\n  -')
					.split('*')
					.filter(change => !!change)
					.map(change => `- **${scope}:** ${change.trim()}`)
			: [];
	}

	private static groupCommitsByType(
		changes: Commits,
		commit: {text: string; type: CommitType; breakingChanges: string[]}
	): Commits {
		return {
			...changes,
			[commit.type]: [...changes[commit.type], commit.text],
			breakingChanges: [...changes.breakingChanges, ...commit.breakingChanges],
		};
	}

	private static prependRelease(commits: Commits, previousTag: string, version: string): void {
		if (commits.feat.length || commits.fix.length) {
			Files.overwrite('CHANGELOG.md', content =>
				[
					Changelog.getTitle(version, previousTag),
					Changelog.getSection(commits.fix, 'Bug Fixes'),
					Changelog.getSection(commits.feat, 'Features'),
					Changelog.getSection(commits.breakingChanges, 'BREAKING CHANGES'),
					content,
				].join('\n\n')
			);
		}
	}

	private static getTitle(version: string, previousTag: string): string {
		const date = Changelog.getReleaseDate(version);
		return `# [${version}](https://github.com/oblique-bit/oblique/compare/${previousTag}...${version}) (${date})`;
	}

	private static getReleaseDate(tag: string): string {
		return Git.doTagExist(tag) ? Git.getTagDate(tag) : new Date().toISOString().split('T')[0];
	}

	private static getSection(commits: string[], title: string): string {
		return commits.length ? `## ${title}\n\n${commits.join('\n')}` : '';
	}
}
