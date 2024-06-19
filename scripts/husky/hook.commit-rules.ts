import {readFileSync} from 'fs';
import {getResultFromCommand} from '../shared/utils';
import path from 'path';

interface Header {
	type: string;
	pkg: string;
	scope: string;
	subject: string;
}

class HookCommitRules {
	private static readonly maxLineLength = 100;

	static perform(): void {
		try {
			const message: string[] = readFileSync('.git/COMMIT_EDITMSG')
				.toString()
				.split('\n')
				.filter(line => !line.startsWith('#'));
			HookCommitRules.checkLineLength(message, HookCommitRules.maxLineLength);
			HookCommitRules.checkEmptyLine(message);
			HookCommitRules.checkHeader(message[0]);
			HookCommitRules.checkBreakingChanges(message);
		} catch (err) {
			console.error(`\nInvalid commit message:\n${(err as Error).message}.\n\nSee details in CONTRIBUTING.md.\n`);
			process.exit(1);
		}
	}

	private static checkLineLength(lines: string[], maxLength: number): void {
		if (lines.some(line => line.length > maxLength)) {
			throw new Error(
				lines
					.map((line, index) => ({length: line.length, index: HookCommitRules.numeral(index)}))
					.filter(({length}) => length > maxLength)
					.map(({length, index}) => `${index} line is ${length - maxLength} characters over the limit of ${maxLength}`)
					.join('. ')
			);
		}
	}

	private static checkEmptyLine(lines: string[]): void {
		if (lines.length > 1 && !/^$/.test(lines[1])) {
			throw new Error(`2nd line has to be empty`);
		}
	}

	private static checkHeader(header: string): void {
		HookCommitRules.checkHeaderFormat(header);
		const {type, pkg, scope, subject} = HookCommitRules.extractHeaderParts(header);
		const contributing: string = readFileSync('CONTRIBUTING.md', 'utf8').toString();
		HookCommitRules.checkType(type, HookCommitRules.extractList(contributing, 'Type'));
		HookCommitRules.checkPackage(pkg, HookCommitRules.extractList(contributing, 'Package'));
		HookCommitRules.checkScope(scope, pkg);
		HookCommitRules.checkSubject(subject);
	}

	private static checkHeaderFormat(header: string): void {
		if (!/^[a-z-]+(?:\([a-z-/]+(?:\/[a-z-]+)?\))?:\s.+$/.test(header)) {
			throw new Error(`1st line matches neither the "type(package/scope): subject" nor the "type(package): subject" formats`);
		}
	}

	private static extractHeaderParts(header: string): Header {
		// "as unknown as Header" is necessary because Typescript can't infer the type directly from the regex
		return /^(?<type>[a-z-]+)\((?<pkg>[a-z-]+)(?:\/(?<scope>[a-z-]+))?\)?:\s(?<subject>.+)$/.exec(header)?.groups as unknown as Header;
	}

	private static checkType(type: string, types: string[]): void {
		if (!types.includes(type)) {
			throw new Error(`1st line has an invalid type '${type}'. Allowed types are: ${HookCommitRules.join(types)}`);
		}
	}

	private static checkPackage(pkg: string, packages: string[]): void {
		if (!packages.includes(pkg)) {
			throw new Error(`1st line has an invalid type '${pkg}'. Allowed packages are: ${HookCommitRules.join(packages)}`);
		}

		const filePaths = getResultFromCommand('git diff --cached --name-only')
			.split('\n')
			.filter(filePath => !!filePath)
			.filter(filePath => !new RegExp(`projects/${HookCommitRules.getFolderName(pkg)}/.*`).test(filePath));
		if (filePaths.length && pkg !== 'toolchain') {
			throw new Error(
				`1st line has an invalid package '${pkg}' that some commited files aren't compatible with: ${HookCommitRules.join(filePaths)}`
			);
		}
	}

	private static checkScope(scope: string, pkg: string): void {
		if (pkg === 'toolchain' && scope) {
			throw new Error(`1st line has an invalid scope '${scope}'. No scope are allowed with 'toolchain' package`);
		}

		if (scope) {
			const contributing: string = readFileSync(path.join('projects', pkg, 'CONTRIBUTING.md'), 'utf8').toString();
			const scopes = HookCommitRules.extractList(contributing, 'Scope');

			if (!scopes.includes(scope)) {
				throw new Error(
					`1st line has an invalid scope '${scope}'. Allowed scopes for '${pkg}' package are: ${HookCommitRules.join(scopes)}`
				);
			}
		}
	}

	private static checkSubject(subject: string): void {
		if (/^[A-Z]/.test(subject)) {
			throw new Error(`1st line has an invalid subject, the first letter must be lower case`);
		}

		if (subject.endsWith('.')) {
			throw new Error('1st line has an invalid subject, it must not end with a dot "."');
		}
	}

	private static checkBreakingChanges(lines: string[]): void {
		const lineIndex: number = lines.findIndex(line => line.toLowerCase().includes('breaking change'));
		// skip 1st line as it may contain the "breaking change" string
		if (lineIndex > 0) {
			if (!/^BREAKING CHANGE:$/.test(lines[lineIndex])) {
				throw new Error(`${HookCommitRules.numeral(lineIndex)} line must be exactly "BREAKING CHANGE:".`);
			}
			if (!lines[lineIndex + 1]?.length) {
				throw new Error(`${HookCommitRules.numeral(lineIndex + 1)} line cannot be empty as it follows a breaking change declaration`);
			}
		}
	}

	private static getFolderName(pkg: string): string {
		switch (pkg) {
			case 'service-navigation':
				return 'service-navigation-web-component';
			default:
				return pkg;
		}
	}

	private static numeral(digit: number): string {
		switch (digit + 1) {
			case 1:
				return '1st';
			case 2: // eslint-disable-line no-magic-numbers
				return '2nd';
			case 3: // eslint-disable-line no-magic-numbers
				return '3rd';
			default:
				return `${digit + 1}th`;
		}
	}

	private static extractList(contributing: string, type: string): string[] {
		return new RegExp(`(?<=# <a name="${type.toLowerCase()}"><\\/a> ${type}.*)(?<block>- .*?^$)`, 'sm')
			.exec(contributing)
			.groups.block.split('\n')
			.filter(line => !!line)
			.map(line => /(?<=\*\*)(?<item>[a-z-]+)(?=\*\*)/.exec(line).groups.item);
	}

	private static join(list: string[]): string {
		return list.join(', ').replace(/,(?=[^,]*$)/, ' and');
	}
}

HookCommitRules.perform();
