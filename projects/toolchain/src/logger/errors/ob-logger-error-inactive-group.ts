import {ObLoggerError} from './ob-logger-error';

/**
 * Error thrown when a method is called on an {@link ObGroupLogger} after {@link ObGroupLogger#end|end()} has been called.
 *
 * This error indicates that the logger group is inactive and no further steps or group operations
 * are allowed.
 *
 * @example
 * ```ts
 * const group = logger.group('Build');
 * group.end();
 * group.step('Transpile'); // throws ObLoggerInactiveGroupError
 * ```
 *
 * @extends ObLoggerError
 */
export class ObLoggerInactiveGroupError extends ObLoggerError {
	constructor(method: string) {
		super(`Cannot call "${method}" after calling "end"`);
		this.name = 'ObLoggerInactiveGroupError';
		Object.setPrototypeOf(this, ObLoggerInactiveGroupError.prototype);
	}
}
