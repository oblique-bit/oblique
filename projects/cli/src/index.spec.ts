import {spawnSync} from 'child_process';
import * as path from 'path';
import * as packageFile from './../package.json';

describe('CLI Tests with ts-node', () => {
	let cliPath: string;
	const expectedHelpText = `Usage: ob new <project-name> Creates a new project in current place or ob update <project-name> Updates the oblique package in the project and runs migration Oblique CLI for managing projects Options: -V, --version output the version number -h, --help display help for command
    `;
	beforeAll(() => {
		cliPath = path.resolve(__dirname, './index.ts');
	});

	test.each(['-V', '--version'])(`with %s set the version from package.json`, flag => {
		const result = spawnSync('ts-node', [cliPath, flag], {
			encoding: 'utf-8'
		});
		expect(cleanOutput(result.stdout)).toBe(cleanOutput(packageFile.version));
	});

	test.each(['-h', '--help'])(`with %s show help text`, flag => {
		const result = spawnSync('ts-node', [cliPath, flag], {
			encoding: 'utf-8'
		});
		expect(cleanOutput(result.stdout)).toContain(cleanOutput(expectedHelpText));
	});

	describe.each([
		{correctOption: '--help', wrongOption: '--holp'},
		{correctOption: '--version', wrongOption: '--vorsion'}
	])(`$wrongOption instead of $correctOption`, ({wrongOption, correctOption}) => {
		test(`show suggestion "(Did you mean ${correctOption}?)"`, () => {
			const result = spawnSync('ts-node', [cliPath, wrongOption], {
				encoding: 'utf-8'
			});
			expect(cleanOutput(result.stderr)).toContain(`(Did you mean ${correctOption}?)`);
		});
	});

	describe.each([
		{correctOption: '--help', wrongOption: '--holp'},
		{correctOption: '-V', wrongOption: '-v'},
		{correctOption: '--version', wrongOption: '--wersion'}
	])('$wrongOption instead of $correctOption', ({wrongOption}) => {
		test(`show  "error: unknown option '${wrongOption}'"`, () => {
			const result = spawnSync('ts-node', [cliPath, wrongOption], {
				encoding: 'utf-8'
			});
			expect(cleanOutput(result.stderr)).toContain(`error: unknown option '${wrongOption}'`);
		});

		test(`show help after error`, () => {
			const result = spawnSync('ts-node', [cliPath, wrongOption], {
				encoding: 'utf-8'
			});
			expect(cleanOutput(result.stderr)).toContain(cleanOutput(expectedHelpText));
		});
	});

	function cleanOutput(output: string): string {
		return output.replace(/\s+/g, ' ').trim();
	}
});
