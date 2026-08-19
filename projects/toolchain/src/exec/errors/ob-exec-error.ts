/**
 * Base abstract error class for all custom errors thrown by the Oblique exec feature.
 *
 * Subclasses extend this class to create specific exec-related errors:
 * - {@link ObSpawnError}
 * - {@link ObSpawnSignalError}
 * - {@link ObSpawnExitError}
 *
 * @abstract
 * @extends Error
 */
export abstract class ObExecError extends Error {
	protected constructor(message: string) {
		super(`ObExecError - ${message}`);
		this.name = 'ObExecError';
		Object.setPrototypeOf(this, ObExecError.prototype);
	}
}
