import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {infoHighlights, infoMigration, installDependencies, success} from '../utils';
import {checkDependencies} from './ng-update-utils';
import {ObIDependencies, ObIMigrations} from './ng-update.model';
import {UpdateV4toV5} from './update-v4-to-v5';
import {UpdateV5toV6} from './update-v5-to-v6';
import {UpdateV6toV7} from './update-v6-to-v7';
import {UpdateV7toV8} from './update-v7-to-v8';
import {UpdateV8toV9} from './update-v8-to-v9';
import {UpdateV9toV10} from './update-v9-to-v10';
import {UpdateV10toV11} from './update-v10-to-v11';

export function upgradeToV5(_options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV4toV5(), _options);
}

export function upgradeToV6(_options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV5toV6(), _options);
}

export function upgradeToV7(_options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV6toV7(), _options);
}

export function upgradeToV8(_options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV7toV8(), _options);
}

export function upgradeToV9(_options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV8toV9(), _options);
}

export function upgradeToV10(_options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV9toV10(), _options);
}

export function upgradeToV11(_options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext) => startup(new UpdateV10toV11(), _options);
}

function startup(migrations: ObIMigrations, _options: Record<string, any>): Rule {
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
