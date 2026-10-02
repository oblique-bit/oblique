// spawnSync needs to be mocked before it is imported. since any other import statement may also import spawnSync, the mock
// need to be the first thing in this file

vi.mock('child_process', async () => ({
	...((await vi.importActual<typeof import('child_process')>('child_process')) as object),
}));

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import * as nodeChildProcess from 'child_process';
import {obSpawnCommand} from './spawn-command';
import {ObSpawnError} from './errors/ob-spawn-error';
import {ObSpawnSignalError} from './errors/ob-spawn-signal-error';
import {ObSpawnExitError} from './errors/ob-spawn-exit-error';

describe(obSpawnCommand.name, () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('success', () => {
		let fixtureDir: string;

		beforeEach(() => {
			fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spawn-command-'));
			fs.writeFileSync(
				path.join(fixtureDir, 'fixture.js'),
				`if (process.argv[2] === 'fail') { process.exit(3); }\nprocess.stdout.write('hello');\n`
			);
		});

		afterEach(() => {
			fs.rmSync(fixtureDir, {recursive: true, force: true});
		});

		test('without options', () => {
			const result = obSpawnCommand(process.execPath, ['fixture.js'], {cwd: fixtureDir});

			expect(result).toBe('hello');
		});

		test('with options', () => {
			const result = obSpawnCommand(process.execPath, ['fixture.js'], {cwd: fixtureDir});

			expect(result).toBe('hello');
		});
	});

	// Windows and Linux report spawn failures differently: on Linux a terminated process sets `signal`, while on
	// Windows `signal` stays null and termination surfaces as a non-zero exit code. With `shell: true` (set on
	// Windows), an unknown command also reports a non-zero exit code instead of an `error`. Since these branches
	// cannot be triggered deterministically with real commands on every OS, the failure tests stub `spawnSync`.
	describe('failure', () => {
		test(ObSpawnError.name, () => {
			vi.spyOn(nodeChildProcess, 'spawnSync').mockReturnValueOnce(
				mockSpawnResult({error: new Error('spawnSync my-command ENOENT')}) as never
			);

			expect(() => {
				obSpawnCommand('my-command', []);
			}).toThrow("ObExecError - Failed to execute 'my-command': spawnSync my-command ENOENT");
		});

		test(ObSpawnSignalError.name, () => {
			vi.spyOn(nodeChildProcess, 'spawnSync').mockReturnValueOnce(mockSpawnResult({signal: 'SIGKILL'}) as never);

			expect(() => {
				obSpawnCommand('my-command', []);
			}).toThrow('ObExecError - Process was terminated by "SIGKILL" signal');
		});

		test(ObSpawnExitError.name, () => {
			vi.spyOn(nodeChildProcess, 'spawnSync').mockReturnValueOnce(mockSpawnResult({status: 1}) as never);

			expect(() => {
				obSpawnCommand('my-command', []);
			}).toThrow('ObExecError - Command failed with exit code "1"');
		});
	});
});

function mockSpawnResult(overrides: Record<string, unknown> = {}): Record<string, unknown> {
	return {
		pid: 1,
		output: [''],
		stderr: null,
		signal: null,
		stdout: '',
		status: 0,
		...overrides,
	};
}
