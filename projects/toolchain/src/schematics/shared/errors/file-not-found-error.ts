import {ObSchematicsError} from './schematics-error';

/**
 * Error thrown when the given file does not exist
 *
 * @extends ObSchematicsError
 */
export class ObFileNotFoundError extends ObSchematicsError {
	constructor(path: string) {
		super(`Path "${path}" does not exist`);
		this.name = 'ObFileNotFoundError';
		Object.setPrototypeOf(this, ObFileNotFoundError.prototype);
	}
}
