/**
 * Base abstract error class for all custom errors thrown by the Oblique logger.
 *
 * Subclasses extend this class to create specific logger-related errors:
 * - {@link ObLoggerInactiveGroupError}
 * - {@link ObLoggerNoActiveStepError}
 *
 * @abstract
 * @extends Error
 */
export abstract class ObLoggerError extends Error {
	protected constructor(message: string) {
		super(`ObLoggerError - ${message}`);
		this.name = 'ObLoggerError';
		Object.setPrototypeOf(this, ObLoggerError.prototype);
	}
}
