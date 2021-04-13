import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {infoHighlights, infoMigration, installDependencies, success} from '../utils';
import {checkDependencies} from './ng-update-utils';
import {ObIMigrations, ObIDependencies} from './ng-update.model';
import {UpdateV4toV5} from './update-v4-to-v5';
import {UpdateV5toV6} from './update-v5-to-v6';
import {UpdateV6toV7} from './update-v6-to-v7';

export function upgradeToV5(_options: {[key: string]: any}): Rule {
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV4toV5(), _options);
}

export function upgradeToV6(_options: {[key: string]: any}): Rule {
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV5toV6(), _options);
}

export function upgradeToV7(_options: {[key: string]: any}): Rule {
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV6toV7(), _options);
}

function startup(migrations: ObIMigrations, _options: {[key: string]: any}): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Starting migrations');

		return chain([migrations.applyMigrations(_options), installDependencies(), finalize(migrations.dependencies)])(tree, _context);
	};
}

export function finalize(deps: ObIDependencies): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		success(_context, 'Oblique has been successfully migrated. Please review the changes.');
		infoHighlights(
			_context,
			`Let us update other dependencies to conclude.
run %c to update the dependencies to their latest compatible versions and %c to discover other updatable packages.`,
			'npm update',
			'npm outdated'
		);
		checkDependencies(tree, _context, deps);
	};
}
