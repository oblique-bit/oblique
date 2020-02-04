import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { IUpdateSchema, IMigratable } from './update-schema';
import { UpdateV4toV5 } from './update-v4-to-v5';
import { colors } from '@angular-devkit/core/src/terminal';
import { OB_VERSION, OB_LATEST, installDependencies, getCurrentObliqueVersion, OB_LAST_MAJOR_SUPPORT_VERSION } from '../utils';

export function initalize(_options: IUpdateSchema): Rule {
	return (tree: Tree, _context: SchematicContext) => {

		const numericObVersion = getCurrentObliqueVersion(tree).match(/\d+/)[0];

		if ( numericObVersion < OB_LAST_MAJOR_SUPPORT_VERSION ) {
			throw new Error(`[ERROR] Oblique Major ${numericObVersion} is not supported anymore - no migration possible. Sorry.`);
		}

		let migratable: IMigratable = {} as IMigratable;
		let latestVersion = OB_LATEST;

		switch ( _options.targetVersion ) {
			case '5':
				migratable = new UpdateV4toV5();
				latestVersion = OB_VERSION['version-5'].LATEST;
			break;
			case '6':
				_context.logger.info(colors.red('\nNOT SUPPORTED YET, TRY VERSION 5 - ABORTING\n'));
				return tree;
			break;
			default:
		}

		_context.logger.info(colors.green(`\nSTARTING MIGRATION TO OBLIQUE V${_options.targetVersion} \n\n`));

		return chain([
			migratable.applyMigrations(_options),
			migratable.updateToLatest(_options, latestVersion),
			migratable.updatePeerDependencies(_options),
			installDependencies()
		])(tree, _context);
	};
}
