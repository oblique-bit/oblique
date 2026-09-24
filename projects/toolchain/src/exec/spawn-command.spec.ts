// spawnSync needs to be mocked before it is imported. since any other import statement may also import spawnSync, the mock
// need to be the first thing in this file

vi.mock('child_process', () => ({
	spawnSync: vi.fn(),
}));

import {spawnSync} from 'child_process';
import {buildOSSafeCommand, obSpawnCommand} from './spawn-command';
import {ObSpawnError} from './errors/ob-spawn-error';
import {ObSpawnSignalError} from './errors/ob-spawn-signal-error';
import {ObSpawnExitError} from './errors/ob-spawn-exit-error';

describe(obSpawnCommand.name, () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('success', () => {
		test('without options', () => {
			(spawnSync as vi.Mock).mockReturnValueOnce(mockSpawnResult({stdout: 'hello'}));

			const result = obSpawnCommand('my-command', ['arg']);

			expect(result).toBe('hello');
		});

		test('with options', () => {
			(spawnSync as vi.Mock).mockReturnValueOnce(mockSpawnResult({stdout: 'some-dir'}));

			const result = obSpawnCommand('my-command', ['arg'], {cwd: 'some-dir'});

			expect(spawnSync).toHaveBeenCalledWith(
				buildOSSafeCommand('my-command'),
				['arg'],
				expect.objectContaining({cwd: 'some-dir', encoding: 'utf8'})
			);
			expect(result).toBe('some-dir');
		});
	});

	describe('failure', () => {
		test(ObSpawnError.name, () => {
			(spawnSync as vi.Mock).mockReturnValueOnce(mockSpawnResult({error: new Error('spawnSync my-command ENOENT')}));

			expect(() => {
				obSpawnCommand('my-command', []);
			}).toThrow("ObExecError - Failed to execute 'my-command': spawnSync my-command ENOENT");
		});

		test(ObSpawnSignalError.name, () => {
			(spawnSync as vi.Mock).mockReturnValueOnce(mockSpawnResult({signal: 'SIGKILL'}));

			expect(() => {
				obSpawnCommand('my-command', []);
			}).toThrow('ObExecError - Process was terminated by "SIGKILL" signal');
		});

		test(ObSpawnExitError.name, () => {
			(spawnSync as vi.Mock).mockReturnValueOnce(mockSpawnResult({status: 1}));

			expect(() => {
				obSpawnCommand('my-command', []);
			}).toThrow('ObExecError - Command failed with exit code "1"');
		});
	});

	describe.each([
		{platform: 'win32', expected: 'my-command.cmd'},
		{platform: 'linux', expected: 'my-command'},
	] as const)('on $platform', ({platform, expected}) => {
		test('buildOSSafeCommand', async () => {
			const originalProcess = global.process;

			global.process = {...originalProcess, platform};
			try {
				vi.resetModules();
				expect((await import('./spawn-command')).buildOSSafeCommand('my-command')).toBe(expected);
			} finally {
				global.process = originalProcess;
			}
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
