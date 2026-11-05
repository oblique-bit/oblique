import {describe, test} from 'node:test';
import assert from 'node:assert/strict';
import {checkFooter} from './commit-footer';

void describe(checkFooter.name, async () => {
	const fatal = (message: string): never => {
		throw new Error(message);
	};
	const run = (message: string): void => checkFooter(dedent(message).split('\n'), fatal);

	await test('passes without a footer', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test

				The body of the commit message.
			`)
		);
	});

	await test('passes with an issues declaration only', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test

				OUI-4559
			`)
		);
	});

	await test('passes with a breaking changes block only', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test


				BREAKING CHANGE:
				* property \`prop\` has been removed
			`)
		);
	});

	await test('passes with a full footer', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test

				The body.

				OUI-4559
				BREAKING CHANGE:
				* property \`prop\` has been removed
			`)
		);
	});

	await test('passes with multiple issues separated with a comma and a whitespace', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test

				OUI-4559, OUI-4560, GitHub-1234
			`)
		);
	});

	await test('passes with the trailing newline of the commit message file', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test

				OUI-4559
				BREAKING CHANGE:
				* property \`prop\` has been removed
			`)
		);
	});

	await test('passes when "breaking change" appears in the header', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): avoid to breaking change

				OUI-4559
			`)
		);
	});

	await test('passes when "breaking change" appears in the body', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test

				This change avoids a breaking change.

				OUI-4559
			`)
		);
	});

	await test('passes when the header starts with a ticket number', () => {
		assert.doesNotThrow(() =>
			run(`
				OUI-4559

				fix(oblique/alert): test
			`)
		);
	});

	await test('passes when a body line mentions a ticket mid-sentence', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test

				This was used as a fix for OUI-4155 but it no longer applies.
			`)
		);
	});

	await test('passes when a body line mentions a ticket mid-sentence and a footer follows', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test

				This fixes OUI-4155.

				OUI-4559
			`)
		);
	});

	await test('passes when a body line starts with a ticket but is not the trailing block', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test

				OUI-4559 is fixed by this.

				More prose.
			`)
		);
	});

	await test('errors when a blank line separates the issues declaration from "BREAKING CHANGE:"', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					OUI-4559

					BREAKING CHANGE:
					* property \`prop\` has been removed
				`),
			{message: 'The issues declaration must be followed by "BREAKING CHANGE:".'}
		);
	});

	await test('errors when the issues declaration is followed by prose', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					OUI-4559

					More prose.
				`),
			{message: 'The issues declaration must be followed by "BREAKING CHANGE:".'}
		);
	});

	await test('errors when a malformed issues declaration precedes a breaking changes block', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					OUI-4559,OUI-4560

					BREAKING CHANGE:
					* property \`prop\` has been removed
				`),
			{
				message:
					'The issues declaration must contain only ticket numbers separated by a comma and a whitespace, e.g. "OUI-1234, OUI-5678".',
			}
		);
	});

	await test('errors when there is text on the issues declaration line before a breaking changes block', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					OUI-4559 some text

					BREAKING CHANGE:
					* property \`prop\` has been removed
				`),
			{
				message:
					'The issues declaration must contain only ticket numbers separated by a comma and a whitespace, e.g. "OUI-1234, OUI-5678".',
			}
		);
	});

	await test('errors when a malformed issues declaration follows a body line', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					This fixes the issue.
					OUI-4559,OUI-4560
				`),
			{
				message:
					'The issues declaration must contain only ticket numbers separated by a comma and a whitespace, e.g. "OUI-1234, OUI-5678".',
			}
		);
	});

	await test('errors when there is text on an issues declaration line that follows a body line', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					This fixes the issue.
					OUI-4559 some text
				`),
			{
				message:
					'The issues declaration must contain only ticket numbers separated by a comma and a whitespace, e.g. "OUI-1234, OUI-5678".',
			}
		);
	});

	await test('errors when multiple lines match the issues declaration', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					OUI-4559

					OUI-4560
				`),
			{message: 'Only one issues declaration is allowed.'}
		);
	});

	await test('errors when the issues declaration is not separated with exactly ", "', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					OUI-4559,OUI-4560
				`),
			{
				message:
					'The issues declaration must contain only ticket numbers separated by a comma and a whitespace, e.g. "OUI-1234, OUI-5678".',
			}
		);
	});

	await test('errors when there is text on the same line as the issues declaration', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					OUI-4559 some text
				`),
			{
				message:
					'The issues declaration must contain only ticket numbers separated by a comma and a whitespace, e.g. "OUI-1234, OUI-5678".',
			}
		);
	});

	await test('errors when the line before the issues declaration is not blank', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					The body.
					OUI-4559
				`),
			{message: 'The issues declaration must be preceded by a blank line.'}
		);
	});

	await test('errors when the line after the issues declaration is not "BREAKING CHANGE:"', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					OUI-4559
					* Test
				`),
			{message: 'The issues declaration must be followed by "BREAKING CHANGE:".'}
		);
	});

	await test('errors when the line before "BREAKING CHANGE:" is neither blank nor the issues declaration', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test

					The body.
					BREAKING CHANGE:
					* property \`prop\` has been removed
				`),
			{message: '"BREAKING CHANGE:" must be preceded by a blank line or the issues declaration.'}
		);
	});

	await test('errors when the line after "BREAKING CHANGE:" does not start with "*"', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test


					BREAKING CHANGE:
					property \`prop\` has been removed
				`),
			{message: 'The breaking changes block must start with a line beginning with a "*".'}
		);
	});

	await test('errors when there are blank lines after "BREAKING CHANGE:"', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test


					BREAKING CHANGE:
					* property \`prop\` has been removed

					* another one
				`),
			{message: 'The breaking changes block cannot contain empty lines.'}
		);
	});

	await test('errors when there are lines starting with a dash after "BREAKING CHANGE:"', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test


					BREAKING CHANGE:
					* property \`prop\` has been removed
					- another one
				`),
			{message: 'The breaking changes block cannot contain lines starting with a dash "-", use a "*" instead.'}
		);
	});

	await test('passes when a breaking change description wraps onto a continuation line', () => {
		assert.doesNotThrow(() =>
			run(`
				fix(oblique/alert): test


				BREAKING CHANGE:
				* property \`prop\` has been removed
				which was deprecated
			`)
		);
	});

	await test('errors when the breaking changes title is not exact', () => {
		for (const title of ['BREAKING CHANGE: additional text', 'breaking change:']) {
			assert.throws(
				() =>
					run(`
						fix(oblique/alert): test


						${title}
						* property \`prop\` has been removed
					`),
				{message: '"BREAKING CHANGE:" must appear alone on its line.'}
			);
		}
	});

	await test('errors when the breaking changes block is empty', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test


					BREAKING CHANGE:
				`),
			{message: 'The breaking changes block following "BREAKING CHANGE:" cannot be empty.'}
		);
	});

	await test('errors when there are two breaking changes blocks', () => {
		for (const declaration of ['', 'OUI-4559']) {
			assert.throws(
				() =>
					run(`
						fix(oblique/alert): test

						${declaration}
						BREAKING CHANGE:
						* property \`prop\` has been removed
						BREAKING CHANGE:
						* property \`prop\` has been removed twice
					`),
				{message: 'Only one breaking changes block is allowed.'}
			);
		}
	});

	await test('errors when a second breaking changes heading has trailing text', () => {
		assert.throws(
			() =>
				run(`
					fix(oblique/alert): test


					BREAKING CHANGE:
					* property \`prop\` has been removed
					BREAKING CHANGE: additional text
					* property \`prop\` has been removed twice
				`),
			{message: '"BREAKING CHANGE:" must appear alone on its line.'}
		);
	});

	await test('passes when the commit message ends with a whitespace-only line', () => {
		assert.doesNotThrow(() =>
			run(
				[
					'fix(oblique/alert): test',
					'',
					'OUI-4559',
					'BREAKING CHANGE:',
					'* property `prop` has been removed',
					'   ',
				].join('\n')
			)
		);
	});
});

/**
 * Removes the leading newline and the common indentation of a template literal, so that commit messages can be written
 * with the indentation of the surrounding code. Trailing newlines are preserved.
 */
function dedent(text: string): string {
	const lines = text.replace(/^\n/, '').split('\n');
	const indentation = Math.min(...lines.filter(line => line.trim()).map(line => line.length - line.trimStart().length));
	return lines.map(line => line.slice(indentation)).join('\n');
}
