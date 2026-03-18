import type {Rule} from '@angular-devkit/schematics';
import type {ObGroupLogger} from '../../logger';

export function closeLogger(group: ObGroupLogger): Rule {
	return () => {
		group.end();
	};
}
