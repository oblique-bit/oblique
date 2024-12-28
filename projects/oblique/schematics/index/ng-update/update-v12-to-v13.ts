import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV13Schema {}

export class UpdateV12toV13 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV13Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => chain([])(tree, _context);
	}
}
