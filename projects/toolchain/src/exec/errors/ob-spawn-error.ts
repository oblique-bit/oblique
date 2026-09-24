import {ObExecError} from './ob-exec-error.js';

/**
 * Error thrown when the {@link obSpawnCommand} function fails to spawn a new process
 *
 * @extends ObExecError
 */
export class ObSpawnError extends ObExecError {
	constructor(command: string, message: string) {
		super(`Failed to execute '${command}': ${message}`);
		this.name = 'ObSpawnError';
		Object.setPrototypeOf(this, ObSpawnError.prototype);
	}
}
