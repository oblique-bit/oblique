import type {SchematicContext} from '@angular-devkit/schematics';
import type {ObLogger} from './logger.types';
import {Logger} from './logger';

const noop = (): void => {
	/*noop*/
};
const noopWriter = {
	info: noop,
	success: noop,
	warn: noop,
	error: noop,
	raw: noop,
};

/**
 * Creates a new {@link ObLogger} instance that delegates log output to the global console methods or suppresses all
 * output when `silent` is enabled.
 *
 * - `info`, `success` and `raw` messages are routed to `console.info`
 * - `warn` messages are routed to `console.warn`
 * - `error` messages are routed to `console.error`
 *
 * When `silent` is `true`, all log methods are replaced with no-op functions and no output is produced.
 *
 * This logger is suitable for general runtime usage in a Node.js environment
 *
 * @example
 * ```ts
 * const logger = obCreateLogger();
 * logger.info('Start process');
 * logger.success('Process completed');
 *
 * const buildLogger = logger.group('Build project');
 * buildLogger.step('Transpile code');
 * buildLogger.step('Copy assets');
 * buildLogger.end();
 * ```
 *
 * @param silent Whether to suppress all log output.
 * @returns A configured {@link ObLogger} instance that writes to the console.
 */
export function obCreateLogger(silent = false): ObLogger {
	return new Logger(
		silent
			? noopWriter
			: {
					info: console.info,
					success: console.info,
					warn: console.warn,
					error: console.error,
					raw: console.info,
				}
	);
}

/**
 * Creates a new {@link ObLogger} instance that delegates log output to an Angular {@link SchematicContext} logger.
 *
 * - `info`, `success` and `raw` messages are routed to `context.logger.info`
 * - `warn` messages are routed to `context.logger.warn`
 * - `error` messages are routed to `context.logger.error`
 *
 * This logger is intended for use inside Angular schematics, ensuring that log messages integrate properly with the
 * schematics execution environment.
 *
 * @example
 * ```ts
 * return (tree: Tree, context: SchematicContext) => {
 *   const logger = obCreateSchematicsLogger(context).group('Start Schematics');
 *   return chain([doSomething(logger.group('DoSomething')), () => logger.end()])(tree, context);
 * };
 * ```
 *
 * When `silent` is `true`, all log methods are replaced with no-op functions and no output is produced.
 *
 * This logger is suitable for general runtime usage in a Node.js environment
 *
 * @param context - The {@link SchematicContext} providing the underlying logger.
 * @param silent Whether to suppress all log output.
 * @returns A configured {@link ObLogger} instance that writes through the schematics context logger.
 */

export function obCreateSchematicsLogger(context: SchematicContext, silent = false): ObLogger {
	return new Logger(
		silent
			? noopWriter
			: {
					info: message => context.logger.info(message),
					success: message => context.logger.info(message),
					warn: message => context.logger.warn(message),
					error: message => context.logger.error(message),
					raw: message => context.logger.info(message),
				}
	);
}
