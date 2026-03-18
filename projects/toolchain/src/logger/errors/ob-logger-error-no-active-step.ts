import {ObLoggerError} from './ob-logger-error';

/**
 * Error thrown when a method that depends on an active step is called
 * on an {@link ObGroupLogger} before {@link ObGoupLogger#stap|step()} has been called.
 *
 * This error indicates that the logger group has no currently active step,
 * so group operations cannot be performed.
 *
 * @example
 * ```ts
 * const group = logger.group('Build');
 * group.stepError(); // throws ObLoggerNoActiveStepError
 * ```
 *
 * @extends ObLoggerError
 */
export class ObLoggerNoActiveStepError extends ObLoggerError {
	constructor(method: string) {
		super(`Cannot call "${method}" before calling "step"`);
		this.name = 'ObLoggerNoActiveStepError';
		Object.setPrototypeOf(this, ObLoggerNoActiveStepError.prototype);
	}
}
