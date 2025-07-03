import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {warnIfStandalone} from '../utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV14Schema {}

export class UpdateV13toV14 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV14Schema): Rule {
		return (tree: Tree, context: SchematicContext) => chain([warnIfStandalone()])(tree, context);
	}
}
