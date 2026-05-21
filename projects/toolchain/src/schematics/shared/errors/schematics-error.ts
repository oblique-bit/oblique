import {SchematicsException} from '@angular-devkit/schematics';

/**
 * Base abstract error class for all custom errors thrown by the Oblique Schematics.
 *
 * Subclasses extend this class to create specific schematics-related errors:
 * - {@link ObFileNotFoundError}
 *
 * @abstract
 * @extends {@link SchematicsException}
 */
export abstract class ObSchematicsError extends SchematicsException {
	protected constructor(message: string) {
		super(`ObSchematicsError - ${message}`);
		this.name = 'ObSchematicsError';
		Object.setPrototypeOf(this, ObSchematicsError.prototype);
	}
}
