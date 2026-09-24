import {type SpawnSyncOptions, type SpawnSyncOptionsWithStringEncoding, spawnSync} from 'child_process';
import {ObSpawnSignalError} from './errors/ob-spawn-signal-error.js';
import {ObSpawnError} from './errors/ob-spawn-error.js';
import {ObSpawnExitError} from './errors/ob-spawn-exit-error.js';

function isWindows(): boolean {
	return process.platform === 'win32';
}

export function buildOSSafeCommand(command: string): string {
	return isWindows() ? `${command}.cmd` : command;
}

/**
 * This method wraps the {@link spawnSync} command with meaningful error management.
 *
 * @param command The name of the command to execute, for example `npm`
 * @param args The arguments of the command, for example ["install"]
 * @param options Options passed to `spawnSync`.
 * @returns The stdout of the command if everything went well.
 * @throws {ObSpawnError} If the process fails to spawn.
 * @throws {ObSpawnSignalError} If the process is terminated by a signal.
 * @throws {ObSpawnExitError} If the process exits with a non-zero status.
 */
export function obSpawnCommand(
	command: string,
	args: string[],
	options: Omit<SpawnSyncOptions, 'encoding' | 'shell'> = {}
): string {
	const osSafeCommand = buildOSSafeCommand(command);
	const opts: SpawnSyncOptionsWithStringEncoding = {
		...options,
		encoding: 'utf8',
		shell: isWindows(),
	};
	const result = spawnSync(osSafeCommand, args, opts);

	if (result.error) {
		throw new ObSpawnError([command, ...args].join(' '), result.error.message);
	}

	if (result.signal) {
		throw new ObSpawnSignalError(result.signal);
	}

	if (result.status) {
		throw new ObSpawnExitError(result.status, result.stderr);
	}

	return result.stdout;
}
