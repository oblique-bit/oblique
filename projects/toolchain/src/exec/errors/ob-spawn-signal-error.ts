import {ObExecError} from './ob-exec-error.js';

/**
 * Error thrown when the {@link obSpawnCommand} function is terminated by a signal
 *
 * @extends ObExecError
 */
export class ObSpawnSignalError extends ObExecError {
	constructor(signal: NodeJS.Signals) {
		super(`Process was terminated by "${signal}" signal`);
		this.name = 'ObSpawnSignalError';
		Object.setPrototypeOf(this, ObSpawnSignalError.prototype);
	}
}
