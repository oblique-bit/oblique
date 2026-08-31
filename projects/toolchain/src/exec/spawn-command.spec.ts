import {obSpawnCommand} from './spawn-command';
import {ObSpawnError} from './errors/ob-spawn-error';
import {ObSpawnSignalError} from './errors/ob-spawn-signal-error';
import {ObSpawnExitError} from './errors/ob-spawn-exit-error';
import * as process from 'node:process';

describe(obSpawnCommand.name, () => {
	describe('success', () => {
		test('without options', () => {
			const result = obSpawnCommand(process.execPath, ['-e', 'process.stdout.write("hello")']);
			expect(result).toBe('hello');
		});
		test('with options', () => {
			const result = obSpawnCommand(process.execPath, ['-e', 'process.stdout.write(process.cwd())'], {
				cwd: process.cwd(),
			});
			expect(result).toBe(process.cwd());
		});
	});

	describe('failure', () => {
		test(ObSpawnError.name, () => {
			expect(() => {
				obSpawnCommand('my-command', [], {});
			}).toThrow("ObExecError - Failed to execute 'my-command': spawnSync my-command ENOENT");
		});

		test(ObSpawnSignalError.name, () => {
			expect(() => {
				obSpawnCommand(process.execPath, ['-e', 'process.kill(process.pid, "SIGKILL")']);
			}).toThrow('ObExecError - Process was terminated by "SIGKILL" signal');
		});

		test(ObSpawnExitError.name, () => {
			expect(() => {
				obSpawnCommand(process.execPath, ['-e', 'process.exit(1)']);
			}).toThrow('ObExecError - Command failed with exit code "1"');
		});
	});

	describe.each([
		{platform: 'win32', expected: 'my-command.cmd'},
		{platform: 'linux', expected: 'my-command'},
	] as const)('on $platform', ({platform, expected}) => {
		test('buildOSSafeCommand', () => {
			const originalProcess = global.process;

			global.process = {...originalProcess, platform};
			try {
				jest.isolateModules(() => {
					// eslint-disable-next-line @typescript-eslint/no-require-imports
					expect(require('./spawn-command').buildOSSafeCommand('my-command')).toBe(expected);
				});
			} finally {
				global.process = originalProcess;
			}
		});
	});
});
