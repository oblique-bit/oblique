import {type Rule, externalSchematic} from '@angular-devkit/schematics';
import type {ObGroupLogger} from '../../logger';

export function callExternalSchematics(logger: ObGroupLogger, collectionName: string, schematicName: string): Rule {
	return () => {
		logger.step(`Call "${schematicName}" on "${collectionName}"`);
		return externalSchematic(collectionName, schematicName, {});
	};
}
