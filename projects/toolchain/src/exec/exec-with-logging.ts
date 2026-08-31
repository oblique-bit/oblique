import {constants} from 'os';
import type {ObExecOptions, ObExecOptionsFatal, ObExecOptionsNonFatal, ObExecParams} from './types.js';
import {obSpawnCommand} from './spawn-command.js';

const defaultExecOptions = {
	encoding: 'utf-8',
	stdio: 'pipe',
	timeout: 60_000,
	killSignal: 'SIGKILL',
} as const;

/**
 * Node.Js exit codes as defined in {@link https://nodejs.org/api/process.html#exit-codes}
 */
const exitCode = {
	signalBase: 128,
	uncaughtFatalException: 1,
} as const;

/**
 * Executes a shell command synchronously and logs its execution within a logger step.
 *
 * The command is executed using {@link spawnSync}. If the command succeeds:
 * - The step is started via {@link ObGroupLogger#step|step()}.
 * - The command output is logged using {@link ObGroupLogger#logRawOutput|logRawOutput()}.
 * - The trimmed output is returned.
 *
 * If the command fails:
 * - The step is started via {@link ObGroupLogger#step|step()}.
 * - The parsed error output is logged using {@link ObGroupLogger#logRawOutput|logRawOutput()}.
 * - The step is marked as failed via {@link ObGroupLogger#stepError|stepError()}.
 * - `undefined` is returned.
 *
 * @example
 * ```ts
 * const group = logger.group('Build');
 * const output = obExecWithLogging(group, 'npm run build');
 * group.end();
 * ```
 *
 * @param params - Parameters of the command
 * @param params.logger - The active {@link ObGroupLogger} used to log the command execution.
 * @param params.command - The shell command to execute.
 * @param params.options - Optional {@link spawnSync} options. These are **merged with the defaults**, with properties
 *  in `options` taking priority over the default values. Default options:
 *    - `encoding: 'utf-8'` — ensures the output is returned as a string
 *    - `stdio: 'pipe'` — captures stdout/stderr for logging
 *    - `timeout: 60_000` — kills the command if it runs longer than 60 seconds
 *    - `killSignal: 'SIGKILL'` — signal used if the timeout is reached
 *
 * @throws {ObLoggerInactiveGroupError} If the provided logger group has already ended.
 * @returns The trimmed command output if execution succeeds; otherwise `undefined`.
 */
export function obExecWithLogging({logger, command, args, options}: ObExecParams): string | undefined {
	return exec({logger, command, args, isFatal: false, options});
}

/**
 * Executes a shell command synchronously and logs its execution within a logger step.
 *
 * The command is executed using {@link execSync}. If the command succeeds:
 * - The step is started via {@link ObGroupLogger#step|step()}.
 * - The command output is logged using {@link ObGroupLogger#logRawOutput|logRawOutput()}.
 * - The trimmed output is returned.
 *
 * If the command fails:
 * - The step is started via {@link ObGroupLogger#step|step()}.
 * - The parsed error output is logged using {@link ObGroupLogger#logRawOutput|logRawOutput()}.
 * - The step is marked as failed via {@link ObGroupLogger#stepError|stepError()}.
 * - The process is killed.
 *
 * @example
 * ```ts
 * const group = logger.group('Build');
 * const output = obExecWithLoggingOrExit(group, 'npm run build');
 * group.end();
 * ```
 *
 * @param params - Parameters of the command
 * @param params.logger - The active {@link ObGroupLogger} used to log the command execution.
 * @param params.command - The shell command to execute.
 * @param params.options - The options passed to {@link execSync}, defaults to
 * - encoding: 'utf-8'
 * - stdio: 'pipe'
 * - timeout: 60_000
 * - killSignal: 'SIGKILL'
 * @throws {ObLoggerInactiveGroupError} If the provided logger group has already ended.
 * @returns The trimmed command output if execution succeeds.
 */
export function obExecWithLoggingOrExit({logger, command, args, options}: ObExecParams): string {
	return exec({logger, command, args, isFatal: true, options});
}

/**
 * Function overload, see {@link https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads}
 */
function exec(options: ObExecOptionsFatal): string;
function exec(options: ObExecOptionsNonFatal): string | undefined;
function exec({logger, command, args, isFatal, options}: ObExecOptions): string | undefined {
	logger.step(`Execute: ${command}`);

	try {
		const output = obSpawnCommand(command, args || [], {
			...defaultExecOptions,
			...(options ?? {}),
		}).trim();
		logger.logRawOutput(output);
		return output;
	} catch (error) {
		const [firstLine, ...rest] = parseError(error).split('\n');
		logger.logRawOutput([`${firstLine} (status: ${getExitCode(error)})`, ...rest].join('\n'));
		logger.stepError();
		if (isFatal) {
			process.exit(getExitCode(error));
		}
		return undefined;
	}
}

function parseError(error: unknown): string {
	if (error instanceof Error) {
		return error.stack ?? error.message;
	}
	if (error !== null && typeof error === 'object') {
		if (hasStandardOutput(error)) {
			return error.stderr ?? error.stdout;
		}
		try {
			return JSON.stringify(error);
		} catch {
			// noop
		}
	}
	if (typeof error === 'string') {
		return error;
	}
	if (typeof error === 'number' || typeof error === 'boolean') {
		return String(error);
	}

	return 'Unknown error';
}

function hasStandardOutput(
	error: object
): error is {stdout: string; stderr: string} | {stdout: string; stderr?: never} | {stdout?: never; stderr: string} {
	return (
		('stderr' in error && typeof error.stderr === 'string') || ('stdout' in error && typeof error.stdout === 'string')
	);
}

/**
 * The exit code should match that of the original error, which is defined either by its status or its signal property
 */
function getExitCode(error: unknown): number {
	if (error !== null && typeof error === 'object') {
		if ('status' in error && typeof error.status === 'number') {
			return error.status;
		}
		if ('signal' in error && typeof error.signal === 'string' && isNodeSignal(error.signal)) {
			return constants.signals[error.signal] + exitCode.signalBase;
		}
	}
	return exitCode.uncaughtFatalException;
}

function isNodeSignal(signal: string): signal is NodeJS.Signals {
	return signal in constants.signals;
}
