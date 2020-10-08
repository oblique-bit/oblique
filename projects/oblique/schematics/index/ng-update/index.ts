import {execSync} from 'child_process';
import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {IMigratable, IUpdateSchema} from './update-schema';
import {infoHighlights, infoMigration, installDependencies, success} from '../ng-utils';
import {UpdateV4toV5} from './update-v4-to-v5';

export function upgradeToV5(_options: IUpdateSchema): Rule {
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV4toV5(), _options);
}

export function upgradeToV6(_options: IUpdateSchema): Rule {
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV4toV5(), _options);
}

function startup(migrations: IMigratable, _options: IUpdateSchema): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Preparing tools for migration');
		execSync('npm i --no-save --silent ts-morph');

		return chain([migrations.applyMigrations(_options), installDependencies(), finalize()])(tree, _context);
	};
}

export function finalize(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		success(_context, 'Oblique has been successfully migrated. Please review the changes.');
		infoHighlights(
			_context,
			`Let us update other dependencies to conclude.
run %c to update the dependencies to their latest compatible versions and %c to discover other updatable packages.`,
			'npm update',
			'npm outdated'
		);
	};
}
