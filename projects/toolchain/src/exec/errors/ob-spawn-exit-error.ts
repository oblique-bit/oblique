import {ObExecError} from './ob-exec-error.js';

/**
 * Error thrown when the {@link obSpawnCommand} function exits with a non-zero status
 *
 * @extends ObExecError
 */
export class ObSpawnExitError extends ObExecError {
	constructor(status: number, error: string) {
		super(`Command failed with exit code "${status}":\n${error}`);
		this.name = 'ObSpawnExitError';
		Object.setPrototypeOf(this, ObSpawnExitError.prototype);
	}
}
