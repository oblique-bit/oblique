import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {warnIfStandalone} from '../utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV15Schema {}

export class UpdateV14toV15 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV15Schema): Rule {
		return (tree: Tree, context: SchematicContext) => chain([warnIfStandalone()])(tree, context);
	}
}
