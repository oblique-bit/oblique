import {executeCommandWithLog, getResultFromCommand} from './utils';

export class Git {
	private static readonly format = {
		subject: '%s',
		body: '%b',
		hash: '%H'
	};
	private static readonly diffRange = {
		changedFiles: '--cached',
		latestHead: 'HEAD@{1} HEAD'
	};
	private static readonly diffOptions = {
		fileNameOnly: 'name-only'
	};

	static commit(header: string, ...lines: string[]): void {
		executeCommandWithLog(`git commit ${[`-am "${header}"`, ...lines].join(' -m ')}`, `Commit changes`);
	}

	static createBranchFrom(branch: string, sourceBranch: string): void {
		executeCommandWithLog(`git checkout -b ${branch} --no-track ${sourceBranch}`, `Create ${branch} branch from ${sourceBranch}`);
	}

	static doTagExist(tag: string): boolean {
		return getResultFromCommand(`git tag -l ${tag}`) === tag;
	}

	static fetch(branch: string): void {
		executeCommandWithLog(`git fetch origin ${branch}`, `Fetch ${branch} branch`);
	}

	static getCurrentBranchName(): string {
		return getResultFromCommand('git branch --show-current');
	}

	static getChangedFileNames(): string {
		return getResultFromCommand('git diff --cached --name-only');
	}

	static getFileNameDiffWithLastHead(): string {
		return getResultFromCommand('git diff --name-only HEAD@{1} HEAD');
	}

	static getLatestTag(): string {
		return getResultFromCommand('git describe --tags --abbrev=0');
	}

	static getTagDate(tag: string): string {
		return getResultFromCommand(`git log -1 --format=%as ${tag}`);
	}

	static listExistingTags(): string {
		return getResultFromCommand('git tag --sort v:refname');
	}

	static getTagsByPattern(pattern: string): string {
		return getResultFromCommand(`git tag -l "${pattern}"`);
	}

	static listCommits(format: (keyof typeof Git.format)[], separator: string, commitSeparator: string, from: string, to: string): string {
		const fullFormat = format.map(item => Git.format[item]).join(separator);
		return getResultFromCommand(`git log --pretty=format:"${fullFormat}${commitSeparator}" ${from}..${to}`);
	}
}
