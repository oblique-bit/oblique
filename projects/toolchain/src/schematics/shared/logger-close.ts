import type {Rule} from '@angular-devkit/schematics';
import type {ObGroupLogger} from '../../logger';

/**
 * Closes a logger group by marking it as completed.
 *
 * @param group - The logger group to close.
 * @returns A {@link Rule} that ends the specified logger group.
 */
export function closeLogger(group: ObGroupLogger): Rule {
	return () => {
		group.end();
	};
}
