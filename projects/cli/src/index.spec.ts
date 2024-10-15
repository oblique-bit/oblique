import {SpawnSyncOptions, spawnSync} from 'child_process';
import * as path from 'path';
import * as packageFile from './../package.json';

describe('Oblique CLI', () => {
	let cliPath: string;
	const workingDirectory = path.resolve(__dirname, '../../../../');
	const options = {
		encoding: 'utf-8',
		stdio: 'pipe',
		shell: true,
		cwd: workingDirectory
	} as SpawnSyncOptions;

	beforeAll(() => {
		cliPath = path.resolve(__dirname, './index.ts');
	});

	describe.each(['-h', '--help'])('help option with %s', flag => {
		test(`stdout should not be empty`, () => {
			const result = spawnSync('ts-node', [cliPath, flag], options);
			expect(result.stdout).not.toBe('');
		});

		test(`stderr should be empty`, () => {
			const result = spawnSync('ts-node', [cliPath, flag], options);
			expect(result.stderr).toBe('');
		});
	});

	describe.each(['-v', '--version'])('version option with %s', flag => {
		test(`stdout should contain the version from package.json`, () => {
			const result = spawnSync('ts-node', [cliPath, flag]);
			expect(cleanOutput(result.stdout)).toBe(cleanOutput(packageFile.version));
		});

		test(`stderr should be empty`, () => {
			const result = spawnSync('ts-node', [cliPath, flag], options);
			expect(result.stderr).toBe('');
		});
	});

	describe.each([
		{correctOption: '--help', wrongOption: '--holp'},
		{correctOption: '--version', wrongOption: '--vorsion'}
	])(`Wrong Option $wrongOption instead of $correctOption`, ({wrongOption, correctOption}) => {
		test(`show suggestion "(Did you mean ${correctOption}?)"`, () => {
			const result = spawnSync('ts-node', [cliPath, wrongOption], options);
			expect(cleanOutput(result.stderr.toString())).toContain(`(Did you mean ${correctOption}?)`);
		});

		test(`stdout should be empty`, () => {
			const result = spawnSync('ts-node', [cliPath, wrongOption], options);
			expect(result.stdout).toBe('');
		});
	});

	describe('error handling for unknown options', () => {
		test(`stderr should contain "error: unknown option '--unicornpoop'"`, () => {
			const result = spawnSync('ts-node', [cliPath, '--unicornpoop'], options);
			expect(cleanOutput(result.stderr)).toContain(`error: unknown option '--unicornpoop'`);
		});

		test(`stdout should be empty for unknown option`, () => {
			const result = spawnSync('ts-node', [cliPath, '--unicornpoop'], options);
			expect(result.stdout).toBe('');
		});
	});

	function cleanOutput(output: Buffer | string): string {
		const outputString = output.toString();
		return outputString.replace(/\s+/g, ' ').trim();
	}
});
