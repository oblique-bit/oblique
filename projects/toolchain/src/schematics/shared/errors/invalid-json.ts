import {ObSchematicsError} from './schematics-error';

/**
 * Error thrown when the given JSON file is not valid
 *
 * @extends ObSchematicsError
 */
export class ObInvalidJsonError extends ObSchematicsError {
	constructor(path: string, message?: string) {
		super(message ?? `Failed to parse "${path}" as JSON. Object expected at offset: 0`);
		this.name = 'ObInvalidJsonError';
		Object.setPrototypeOf(this, ObInvalidJsonError.prototype);
	}
}
