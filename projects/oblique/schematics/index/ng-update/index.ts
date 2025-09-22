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
import {UpdateV11toV12} from './update-v11-to-v12';
import {UpdateV12toV13} from './update-v12-to-v13';
import {UpdateV13toV14} from './update-v13-to-v14';

export function upgradeToV5(options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext) => startup(new UpdateV4toV5(), options);
}

export function upgradeToV6(options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext) => startup(new UpdateV5toV6(), options);
}

export function upgradeToV7(options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext) => startup(new UpdateV6toV7(), options);
}

export function upgradeToV8(options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext) => startup(new UpdateV7toV8(), options);
}

export function upgradeToV9(options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext) => startup(new UpdateV8toV9(), options);
}

export function upgradeToV10(options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext) => startup(new UpdateV9toV10(), options);
}

export function upgradeToV11(options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext) => startup(new UpdateV10toV11(), options);
}

export function upgradeToV12(options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext) => startup(new UpdateV11toV12(), options);
}

export function upgradeToV13(options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext) => startup(new UpdateV12toV13(), options);
}

export function upgradeToV14(options: Record<string, any>): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext) => startup(new UpdateV13toV14(), options);
}

function startup(migrations: ObIMigrations, options: Record<string, any>): Rule {
	return (tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Starting migrations');

		return chain([migrations.applyMigrations(options), installDependencies(), finalize(migrations.dependencies)])(tree, context);
	};
}

export function finalize(deps: ObIDependencies): Rule {
	return (tree: Tree, context: SchematicContext) => {
		success(context, 'Oblique has been successfully migrated. Please review the changes.');
		infoHighlights(
			context,
			`Let us update other dependencies to conclude.
run %c to update the dependencies to their latest compatible versions and %c to discover other updatable packages.`,
			'npm update',
			'npm outdated'
		);
		checkDependencies(tree, context, deps);
	};
}
