import {type Rule, externalSchematic} from '@angular-devkit/schematics';
import type {ObGroupLogger} from '../../logger';

/**
 * Invoke a schematic form another schematic collection. The collection must already be installed.
 *
 * @param logger - The logger group used to log the execution of the external schematic
 * @param collectionName - The name of the package containing the schematic (e.g. `@angular/schematics` or `@oblique/toolchain`)
 * @param schematicName - The name of the schematic to execute
 * @return A {@link Rule} that executes the specified external schematic
 */
export function callExternalSchematics(logger: ObGroupLogger, collectionName: string, schematicName: string): Rule {
	return () => {
		logger.step(`Call "${schematicName}" on "${collectionName}"`);
		return externalSchematic(collectionName, schematicName, {});
	};
}
