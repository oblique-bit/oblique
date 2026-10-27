/** A single ticket reference, e.g. "OUI-1234" or "GitHub-5678". */
const ticketRegexp = /^\w+-\d+$/;
/** A line that begins with a ticket reference, even when the rest of the line is malformed. */
const ticketStartRegexp = /^\w+-\d+/;
const breakingChangeTitle = 'BREAKING CHANGE:';
const breakingChangeStartRegexp = /^BREAKING CHANGE(?::|$)/i;

/**
 *
 * Validates the footer of a commit message. The footer is made of an optional issues declaration line followed by an
 * optional breaking changes block. Both are only recognized when they start after a blank line.
 *
 * @param lines the commit message lines, without the comment lines
 * @param fatal the function to call with an error message when a rule is broken
 */
export function checkFooter(lines: string[], fatal: (message: string) => void): void {
	const message = trimTrailingEmptyLines(lines);
	const issuesIndexes = findIssuesDeclarations(message);
	if (issuesIndexes.length > 1) {
		fatal('Only one issues declaration is allowed.');
	}
	const issuesIndex = issuesIndexes[0];
	if (issuesIndex !== undefined) {
		checkIssuesDeclaration(message, issuesIndex, fatal);
	}
	checkFooterIssuesFormat(message, fatal);
	const breakingChangeIndex = message.findIndex((line, index) => index > 0 && breakingChangeStartRegexp.test(line));
	if (breakingChangeIndex !== -1) {
		if (message[breakingChangeIndex] !== breakingChangeTitle) {
			fatal(`"${breakingChangeTitle}" must appear alone on its line.`);
		}
		checkBreakingChangesBlock(message, breakingChangeIndex, issuesIndex, fatal);
	}
}

/**
 * Returns the indexes of the lines that are an issues declaration, i.e. a line made only of ticket references. The
 * header is skipped as it may legitimately start with a ticket number.
 */
function findIssuesDeclarations(lines: string[]): number[] {
	return lines
		.map((line, index) => ({index, line}))
		.filter(({index, line}) => index > 0 && isIssuesDeclaration(line))
		.map(({index}) => index);
}

/**
 * An issues declaration is a comma and whitespace separated list of ticket references, e.g. "OUI-1234, OUI-5678".
 */
function isIssuesDeclaration(line: string): boolean {
	return line.split(', ').every(ticket => ticketRegexp.test(ticket));
}

/**
 * Checks that every line of the footer that starts with a ticket reference is a valid issues declaration. This catches a
 * malformed declaration that is not made only of ticket references, which {@link findIssuesDeclarations} cannot detect.
 */
function checkFooterIssuesFormat(lines: string[], fatal: (message: string) => void): void {
	lines.slice(findFooterStart(lines)).forEach(line => {
		if (ticketStartRegexp.test(line) && !isIssuesDeclaration(line)) {
			fatal(
				'The issues declaration must contain only ticket numbers separated by a comma and a whitespace, e.g. "OUI-1234, OUI-5678".'
			);
		}
	});
}

/**
 * Returns the index of the first line of the footer. The footer is the last block of the message. When that block is a
 * breaking changes block, a malformed issues declaration may precede it, separated by a blank line, so the footer is
 * extended backwards to include it.
 */
function findFooterStart(lines: string[]): number {
	let start = lines.length - 1;
	while (start > 0 && !isEmpty(lines[start - 1])) {
		start--;
	}
	const isPrecededByDeclaration =
		lines[start] === breakingChangeTitle &&
		start >= 2 &&
		isEmpty(lines[start - 1]) &&
		ticketStartRegexp.test(lines[start - 2]);
	return isPrecededByDeclaration ? start - 2 : start;
}

function checkIssuesDeclaration(lines: string[], issuesIndex: number, fatal: (message: string) => void): void {
	if (!isEmpty(lines[issuesIndex - 1])) {
		fatal('The issues declaration must be preceded by a blank line.');
	}
	const following = lines[issuesIndex + 1];
	if (following !== undefined && following !== breakingChangeTitle) {
		fatal(`The issues declaration must be followed by "${breakingChangeTitle}".`);
	}
}

function checkBreakingChangesBlock(
	lines: string[],
	breakingChangeIndex: number,
	issuesIndex: number | undefined,
	fatal: (message: string) => void
): void {
	if (breakingChangeIndex - 1 !== issuesIndex && !isEmpty(lines[breakingChangeIndex - 1])) {
		fatal(`"${breakingChangeTitle}" must be preceded by a blank line or the issues declaration.`);
	}
	const items = lines.slice(breakingChangeIndex + 1);
	if (!items.length) {
		fatal(`The breaking changes block following "${breakingChangeTitle}" cannot be empty.`);
	}
	checkSingleBreakingChangesBlock(items, fatal);
	items.forEach((line, index) => {
		if (isEmpty(line)) {
			fatal('The breaking changes block cannot contain empty lines.');
		}
		if (line.startsWith('-')) {
			fatal('The breaking changes block cannot contain lines starting with a dash "-", use a "*" instead.');
		}
		if (index === 0 && !line.startsWith('*')) {
			fatal('The breaking changes block must start with a line beginning with a "*".');
		}
	});
}

/**
 * Checks that the breaking changes block contains a single heading. A second heading is either a duplicate block or a
 * heading with trailing text, which is not allowed either.
 */
function checkSingleBreakingChangesBlock(items: string[], fatal: (message: string) => void): void {
	const secondHeading = items.find(line => breakingChangeStartRegexp.test(line));
	if (secondHeading === undefined) {
		return;
	}
	if (secondHeading !== breakingChangeTitle) {
		fatal(`"${breakingChangeTitle}" must appear alone on its line.`);
	}
	fatal('Only one breaking changes block is allowed.');
}

/**
 * Removes the empty lines that end the commit message, so that the trailing newline of the commit message file is not
 * mistaken for an empty line inside the breaking changes block. Whitespace-only lines are ignored too, as editors may
 * leave them behind.
 */
function trimTrailingEmptyLines(lines: string[]): string[] {
	let lastContentIndex = lines.length - 1;
	while (lastContentIndex >= 0 && isBlank(lines[lastContentIndex])) {
		lastContentIndex--;
	}
	return lines.slice(0, lastContentIndex + 1);
}

function isEmpty(line: string | undefined): boolean {
	return line === undefined || line === '';
}

function isBlank(line: string | undefined): boolean {
	return line === undefined || line.trim() === '';
}
