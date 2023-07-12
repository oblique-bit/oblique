import {readFileSync} from 'fs';

interface Header {
	type: string;
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

	private static checkLineLength(lines: string[], length: number): void {
		if (lines.some(line => line.length > length)) {
			const erroneousLines = lines
				.map((line, index) => (line.length > length ? index : -1))
				.filter(number => number > -1)
				.map(number => HookCommitRules.numeral(number));
			const text = HookCommitRules.join(erroneousLines);
			throw new Error(`${text} line${text.includes('and') ? 's' : ''} exceeds ${length} characters.`);
		}
	}

	private static checkEmptyLine(lines: string[]): void {
		if (lines.length > 1 && !/^$/.test(lines[1])) {
			throw new Error(`2nd line has to be empty`);
		}
	}

	private static checkHeader(header: string): void {
		HookCommitRules.checkHeaderFormat(header);
		const {type, scope, subject} = HookCommitRules.extractHeaderParts(header);
		const contributing: string = readFileSync('CONTRIBUTING.md', 'utf8').toString();
		HookCommitRules.checkType(type, HookCommitRules.extractList(contributing, 'Type'));
		HookCommitRules.checkScope(
			scope,
			HookCommitRules.extractList(contributing, 'Scope prefixes'),
			HookCommitRules.getScopeLists(contributing)
		);
		HookCommitRules.checkSubject(subject);
	}

	private static checkHeaderFormat(header: string): void {
		if (!/^[a-z-]+(?:\([a-z-/]+\))?:\s.+$/.test(header)) {
			throw new Error(`1st line doesn't match the "type(scope): subject" format`);
		}
	}

	private static extractHeaderParts(header: string): Header {
		// "as unknown as Header" is necessary because Typescript can't infer the type directly from the regex
		return /^(?<type>[a-z-]+)(?:\((?<scope>[a-z-/]+)\))?:\s(?<subject>.+)$/.exec(header)?.groups as unknown as Header;
	}

	private static checkType(type: string, types: string[]): void {
		if (!types.includes(type)) {
			throw new Error(`1st line has an invalid type '${type}'. Allowed types are: ${HookCommitRules.join(types)}`);
		}
	}

	private static getScopeLists(contributing: string): Record<string, string[]> {
		return contributing
			.match(/(?<=# )\w+(?= scopes)/g)
			.map(scope => ({
				[scope.toLowerCase()]: HookCommitRules.extractList(contributing, `${scope} scopes`)
			}))
			.reduce((array, current) => ({...array, ...current}), {});
	}

	private static checkScope(fullScope: string, prefixes: string[], scopes: Record<string, string[]>): void {
		HookCommitRules.checkFullScopeValidity(fullScope);

		if (fullScope?.includes('/')) {
			const [prefix, scope] = fullScope.split('/');
			HookCommitRules.checkTwoPartedScope(prefix, scope, prefixes, scopes);
		} else {
			HookCommitRules.checkOnePartedScope(fullScope, prefixes, scopes);
		}
	}

	private static checkOnePartedScope(scope: string, prefixes: string[], scopes: Record<string, string[]>): void {
		const prefixLessScopes: string[] = scopes.additional;
		const allowed: string[] = prefixes.concat(prefixLessScopes);

		if (!allowed.includes(scope)) {
			throw new Error(`1st line has an invalid scope '${scope}'. Allowed one-part scopes are: ${HookCommitRules.join(allowed)}`);
		}
	}

	private static checkTwoPartedScope(prefix: string, scope: string, prefixes: string[], scopes: Record<string, string[]>): void {
		HookCommitRules.checkScopePrefixValidity(prefix, prefixes);
		HookCommitRules.checkScopeValidity(scope, Object.values(scopes).flat());
		HookCommitRules.checkScopeAndPrefixCompatibility(scope, prefix, scopes);
	}

	private static checkFullScopeValidity(fullScope: string): void {
		if (/\/.*\//.test(fullScope)) {
			throw new Error(`1st line has an invalid scope '${fullScope}'. There may be only one prefix`);
		}
	}

	private static checkScopePrefixValidity(prefix: string, prefixes: string[]): void {
		if (prefix && !prefixes.includes(prefix)) {
			throw new Error(`1st line has an invalid scope prefix, '${prefix}'. Allowed prefixes are: ${HookCommitRules.join(prefixes)}`);
		}
	}

	private static checkScopeValidity(scope: string, allScopes: string[]): void {
		if (scope && !allScopes.includes(scope)) {
			throw new Error(`1st line has an invalid scope, '${scope}'. Allowed scopes are: ${HookCommitRules.join(allScopes)}`);
		}
	}

	private static checkScopeAndPrefixCompatibility(scope: string, prefix: string, scopes: Record<string, string[]>): void {
		Object.keys(scopes)
			.filter(scopePrefix => !['additional', 'base'].includes(scopePrefix))
			.forEach(scopePrefix => {
				if (scope && prefix === scopePrefix && ![...scopes[scopePrefix], ...scopes.base].includes(scope)) {
					throw new Error(`1st line has an invalid scope: '${scope}' is not compatible with '${scopePrefix}' prefix`);
				}
			});
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
		const listStartIndex: number = contributing.indexOf(`# ${type}`);
		const listBlock: string = contributing.substring(
			contributing.indexOf('*', listStartIndex),
			contributing.indexOf('#', listStartIndex + 1)
		);
		return listBlock.match(/\*\*.*\*\*/g).map(item => item.replace(/\*\*/g, ''));
	}

	private static join(list: string[]): string {
		return list.join(', ').replace(/,(?=[^,]*$)/, ' and');
	}
}

HookCommitRules.perform();
