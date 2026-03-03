import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {warnIfStandalone} from '../utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV16Schema {}

export class UpdateV15toV16 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV16Schema): Rule {
		return (tree: Tree, context: SchematicContext) => chain([warnIfStandalone()])(tree, context);
	}
}
