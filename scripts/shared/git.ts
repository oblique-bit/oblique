import {executeCommand, getResultFromCommand} from './utils';

export class Git {
	private static readonly format = {
		subject: '%s',
		body: '%b',
		hash: '%h'
	};
	private static readonly diffRange = {
		changedFiles: '--cached',
		latestHead: 'HEAD@{1} HEAD'
	};
	private static readonly diffOptions = {
		fileNameOnly: 'name-only'
	};

	static commit(header: string, ...lines: string[]): void {
		executeCommand(`git commit ${[`-am "${header}"`, ...lines].join(' -m ')}`);
	}

	static createBranchFrom(branch: string, sourceBranch: string): void {
		executeCommand(`git checkout -b ${branch} --no-track ${sourceBranch}`);
	}

	static doTagExist(tag: string): boolean {
		return getResultFromCommand(`git tag -l ${tag}`) === tag;
	}

	static fetch(branch: string): void {
		executeCommand(`git fetch ${branch}`);
	}

	static getBranchName(): string {
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

	static listCommits(format: (keyof typeof Git.format)[], separator: string, commitSeparator: string, from: string, to: string): string {
		const fullFormat = format.map(item => Git.format[item]).join(separator);
		return getResultFromCommand(`git log --pretty=format:"${fullFormat}${commitSeparator}" ${from}..${to}`);
	}
}
